import { DownloadIcon, GoIcon } from '@totejs/icons';
import { Preview } from '../components/svgIcon/Preview';

import { getRandomSp } from '../utils/gfSDK';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { parseGroupName } from '../utils/';
import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { useGlobal } from '../hooks/useGlobal';

interface IOwnActionCom {
  data: {
    id: string;
    groupName: string;
    ownerAddress: string;
    type: string;
  };
  address: string;
  breadInfo?: object;
}
export const OwnActionCom = (obj: IOwnActionCom) => {
  const navigator = useNavigate();
  const { data, breadInfo } = obj;
  const { id, groupName, ownerAddress, type } = data;

  const { name, bucketName } = parseGroupName(groupName);

  //   const [objectInfo, setObjectInfo] = useState<any>();
  //   const [bucketInfo, setBucketInfo] = useState<any>();

  //   useEffect(() => {
  //     Promise.all([
  //       getObjectInfoByName(bucketName, name),
  //       getCollectionInfoByName(bucketName),
  //     ])
  //       .then((result) => {
  //         const [{ objectInfo }, { bucketInfo }] = result;
  //         setBucketInfo(bucketInfo as any);
  //         setObjectInfo(objectInfo as any);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }, []);

  const state = useGlobal();
  const [p] = useSearchParams();

  const [domain, setDomain] = useState('');

  const downloadUrl = useMemo(() => {
    const str = `${domain}/download/${bucketName}/${name}`;
    return str;
  }, [name, bucketName, domain]);

  const previewUrl = useMemo(() => {
    const str = `${domain}/view/${bucketName}/${name}`;
    return str;
  }, [name, bucketName, domain]);

  useEffect(() => {
    getRandomSp().then((result) => {
      setDomain(result);
    });
  }, []);

  return (
    <ActionCon gap={10}>
      {type === 'Data' && (
        // <Copy
        //   value={downloadUrl}
        //   copyToolTips="Copy Download Link to CLipboard"
        // >
        <DownloadIcon
          color={'#AEB4BC'}
          cursor="pointer"
          onClick={async () => {
            window.open(downloadUrl);
            //   onCopyDownLoad();
            // try {
            //   const { visibility, payloadSize } = objectInfo as any;
            //   if (visibility === VisibilityType.VISIBILITY_TYPE_PUBLIC_READ) {
            //     const directDownloadLink = encodeURI(
            //       `${await getRandomSp()}/download/${bucketName}/${encodeObjectName(
            //         name,
            //       )}`,
            //     );
            //     directlyDownload(directDownloadLink);
            //   } else {
            //     const sps = await getSps();
            //     const spIndex = sps.findIndex(function (item: any) {
            //       return item.operatorAddress === bucketInfo?.primarySpAddress;
            //     });
            //     const result = await downloadWithProgress({
            //       bucketName,
            //       objectName: name,
            //       primarySp: sps[spIndex] as IRawSPInfo,
            //       address,
            //       payloadSize,
            //     });
            //     saveFileByAxiosResponse(result, name);
            //   }
            //   console.log(objectInfo);
            //   console.log(data);
            //   console.log(name, bucketName, dataType);
            // } catch (e) {
            //   console.log(e);
            //   toast.error({ description: 'download error' });
            // }
          }}
        />
        // </Copy>
      )}
      {type === 'Data' && (
        // <Copy value={previewUrl} copyToolTips="Copy Preview Link to CLipboard">
        <Preview
          cursor="pointer"
          onClick={async () => {
            window.open(previewUrl);

            // try {
            //   const { visibility, payloadSize } = objectInfo as any;
            //   if (visibility === VisibilityType.VISIBILITY_TYPE_PUBLIC_READ) {
            //     const viewLink = encodeURI(
            //       `${await getRandomSp()}/download/${bucketName}/${encodeObjectName(
            //         name,
            //       )}`,
            //     );
            //     window.open(viewLink, '_blank');
            //   } else {
            //     const sps = await getSps();
            //     const spIndex = sps.findIndex(function (item: any) {
            //       return item.operatorAddress === bucketInfo?.primarySpAddress;
            //     });
            //     const primarySp = sps[spIndex] as IRawSPInfo;
            //     const spOffChainData = await getSpOffChainData({
            //       address,
            //       spAddress: primarySp.operatorAddress,
            //     });
            //     if (!checkSpOffChainDataAvailable(spOffChainData)) {
            //       return;
            //     }
            //     const result = await downloadWithProgress({
            //       bucketName,
            //       objectName: name,
            //       primarySp,
            //       payloadSize: Number(payloadSize),
            //       address,
            //     });
            //     viewFileByAxiosResponse(result);
            //   }
            // } catch (e) {
            //   console.log(e);
            //   toast.error({ description: 'preview error' });
            // }
          }}
        ></Preview>
        // </Copy>
      )}
      <GoIcon
        cursor={'pointer'}
        color={'#AEB4BC'}
        onClick={() => {
          let from = '';
          if (breadInfo) {
            const list = state.globalState.breadList;
            const item = {
              path: (breadInfo as any).path,
              name: (breadInfo as any).name,
              query: p.toString(),
            };
            state.globalDispatch({
              type: 'ADD_BREAD',
              item,
            });

            from = encodeURIComponent(JSON.stringify(list.concat([item])));
          }
          const _from = from ? `&from=${from}` : '';
          navigator(
            `/resource?gid=${id}&gn=${groupName}&address=${ownerAddress}&type=collection&tab=description${_from}`,
          );
        }}
      />
    </ActionCon>
  );
};

const ActionCon = styled(Flex)``;
