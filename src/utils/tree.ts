export const str2tree = (str: string) => {
  const menuObj: any = {};
  let arr: any = [];
  [...new Set<string>(str.split('\n'))].forEach((text) => {
    const itemArr = text
      .split('/')
      .map((e) => e.trim())
      .filter((e) => e);
    arr.push(
      ...itemArr.map((e, i) => ({
        label: e,
        name: e,
        pLabel: itemArr[i - 1],
      })),
    );
  });
  arr = [...new Set(arr.map((e: any) => JSON.stringify(e)))].map((e: any) =>
    JSON.parse(e),
  );
  arr.forEach((item: any) => {
    item.children = [];
    menuObj[item.label] = item;
  });
  arr = arr.filter((item: any) => {
    const childList = menuObj[item?.pLabel]?.children;
    if (childList) childList.push(item);
    return !('pLabel' in item);
  });
  return forEachTree(arr, (e) => {
    delete e.pLabel;
    if (!e.children?.length) delete e.children;
  });
};

function forEachTree(tree: any, callback: (item: any) => void) {
  tree?.forEach((item: any) => {
    callback(item);
    forEachTree(item.children, callback);
  });
  return tree;
}

export function tree2str(arr: any) {
  const strArr: any = [];
  const tree = JSON.parse(JSON.stringify(arr));
  forEachTreeHasParent(tree, undefined, (parent: any, item: any) => {
    item.pLabel = `${parent?.pLabel ?? ''}/${parent?.label ?? ''}`;
    if (parent && !item?.children?.length) {
      strArr.push(
        `${item.pLabel}/${item.label}`
          .split('/')
          .filter((e) => e)
          .join('/'),
      );
    }
  });
  return strArr.join('\n');
}
function forEachTreeHasParent(tree: any, parent: any, callback: any) {
  tree?.forEach((item: any) => {
    callback(parent, item);
    forEachTreeHasParent(item.children, item, callback);
  });
  return tree;
}

interface IItem {
  label: string;
  name: string;
  children?: [];
}
export class Tree {
  root: any;
  constructor(str: string) {
    this.root = this.init(str);
  }

  get list() {
    return this.root;
  }

  init(str: string) {
    const menuObj: any = {};
    let arr: any = [];
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
          const result = {
            label: name,
            name: name,
            _id: id,
            pLabel: itemArr[i - 1],
          };
          return result;
        }),
      );
    });

    arr = [...new Set(arr.map((e: any) => JSON.stringify(e)))].map((e: any) =>
      JSON.parse(e),
    );
    const t: any = {};
    arr = arr.reduce(function (data: any, item: any) {
      t[item._id] ? '' : (t[item._id] = true && item._id && data.push(item));
      return data;
    }, []);

    arr.forEach((item: any) => {
      item.children = [];
      menuObj[item.label] = item;
    });
    arr = arr.filter((item: any) => {
      const childList = menuObj[item?.pLabel]?.children;
      if (childList) childList.push(item);
      return !('pLabel' in item);
    });
    return forEachTree(arr, (e) => {
      delete e.pLabel;
      if (!e.children?.length) delete e.children;
    });
  }

  forEachTree(tree: any, callback: (item: any) => void) {
    tree?.forEach((item: any) => {
      callback(item);
      forEachTree(item.children, callback);
    });
    return tree;
  }

  getItem(name: string, list?: any): IItem | undefined {
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
    const aim = str.split('-');
    let prevColl = this.root;
    let name = '';
    while ((name = aim.shift() as string) && prevColl.length) {
      const res = this.getItem(name, prevColl);
      prevColl = res?.children;
      if (!prevColl) break;
    }
    return prevColl;
  }

  orderTraverse(fn: any, list?: any) {
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
