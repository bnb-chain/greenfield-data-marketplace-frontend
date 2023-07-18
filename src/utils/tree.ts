export interface INode {
  label: string;
  name: string;
  _id: number | string;
  pLabel?: string;
  children?: Array<INode>;
}

function forEachTree(tree: Array<INode>, callback: (item: INode) => void) {
  tree?.forEach((item: INode) => {
    callback(item);
    forEachTree(item.children as Array<INode>, callback);
  });
  return tree;
}

export class Tree {
  root: Array<INode>;
  constructor(str: string) {
    this.root = this.init(str);
  }

  get list() {
    return this.root;
  }

  init(str: string) {
    const menuObj: any = {};
    let arr: Array<INode> = [];
    [...new Set<string>(str.split('\n'))].forEach((text) => {
      const itemArr = text
        .split('/')
        .map((e) => e.trim())
        .filter((e) => e);
      arr.push(
        ...itemArr.map((e, i) => {
          const tt = e.split('__');
          const name = tt[0];
          const id = tt[1];
          const type = tt[2];
          const result = {
            label: name,
            name: name,
            _id: id,
            _type: type,
            pLabel: itemArr[i - 1],
          };
          return result;
        }),
      );
    });

    arr = [...new Set(arr.map((e: INode) => JSON.stringify(e)))].map(
      (e: string) => JSON.parse(e),
    );
    const t: {
      [str: string]: INode;
    } = {};
    arr = arr.reduce(function (data: any, item: any) {
      t[item._id] ? '' : (t[item._id] = true && item._id && data.push(item));
      return data;
    }, []);

    arr.forEach((item: INode) => {
      item.children = [];
      menuObj[item.label] = item;
    });
    arr = arr.filter((item: INode) => {
      const childList = menuObj[item?.pLabel as string]?.children;
      if (childList) childList.push(item);
      return !('pLabel' in item);
    });
    return forEachTree(arr, (e) => {
      delete e.pLabel;
      if (!e.children?.length) delete e.children;
    });
  }

  forEachTree(tree: Array<INode>, callback: (item: INode) => void) {
    tree?.forEach((item: INode) => {
      callback(item);
      forEachTree(item.children as Array<INode>, callback);
    });
    return tree;
  }

  getItem(name: string, list?: Array<INode>): INode | undefined {
    const root = !list ? this.root : list;
    for (let i = 0; i < root.length; i++) {
      const a = root[i];
      if (a.name === name) {
        return a;
      } else {
        if (a.children && a.children.length > 0) {
          const res = this.getItem(name, a.children);
          if (res) {
            return res;
          }
        }
      }
    }
  }

  getDepItem(str: string) {
    const aim = str.split('__');
    let prevColl = this.root;
    let name = '';
    while ((name = aim.shift() as string) && prevColl.length) {
      const res = this.getItem(name, prevColl);
      prevColl = res?.children as INode[];
      if (!prevColl) break;
    }
    return prevColl;
  }

  orderTraverse(fn: (item: INode) => void, list?: Array<INode>) {
    const root = !list ? this.root : list;
    for (let i = 0; i < root.length; i++) {
      const item = root[i];

      if (item.children && item.children.length > 0) {
        this.orderTraverse(fn, item.children);
      }
      fn?.(item);
    }
  }
}
