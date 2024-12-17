const { useEffect, useState } = require('react');
const { default: request } = require('utils/request');

const useSerialNumbers = (selectedMaterialList) => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSerialNumbers = async () => {
      const materialList = selectedMaterialList.filter((item) => item?.material?.isSerialNumber);

      if (!materialList.length) {
        setMessage('There are no materials with serial numbers in this transaction.');
        return;
      }

      setMessage('');

      const fetchPromises = materialList.map(createFetchPromise);

      setPending(true);
      const receivedAllData = await Promise.all(fetchPromises).catch(() => {
        setMessage('An error occurred while fetching the serial numbers.');
        setPending(false);
      });
      if (receivedAllData) {
        setData(receivedAllData);
        setPending(false);
      }
    };

    const createFetchPromise = async (materialItem) => {
      const receivedData = await request('/serial-number-list', {
        method: 'GET',
        query: {
          projectId: materialItem.projectId,
          storeId: materialItem.storeId,
          materialId: materialItem.materialId,
          ...(materialItem.storeLocationId && { storeLocationId: materialItem.storeLocationId }),
          ...(materialItem.id && { stockLedgerId: materialItem.id }),
          sort: ['createdAt', 'ASC']
        }
      });

      if (!receivedData?.success) {
        throw new Error('Issues fetching serial numbers.');
      }

      const serialNos = receivedData?.data?.data?.rows || [];

      return {
        materialName: materialItem?.material?.name,
        materialCode: materialItem?.material?.code,
        serialNumbers: serialNos.map((serialItem) => serialItem.serialNumber)
      };
    };

    fetchSerialNumbers();
  }, [selectedMaterialList]);

  return { data, pending, message };
};

export default useSerialNumbers;
