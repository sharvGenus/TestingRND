import other from 'menu-items/other';
const prefixImport = require('utils/locales/en.json');

const makeData = (otherArray, allMastersOBJ, prefix) => {
  return (otherArray || [])
    .map((oth) => ({
      ...oth,
      visibleName: prefix[oth.id],
      isAccess: allMastersOBJ[JSON.stringify(prefix[oth.id])],
      children: oth.children ? makeData(oth.children, allMastersOBJ, prefix) : undefined
    }))
    .filter((val) => val.isAccess === true);
};

const makeLinearArray = (arr) => {
  return (arr || []).reduce((respArray, val) => {
    return [...respArray, val, ...makeLinearArray(val.child), ...makeLinearArray(val.subChild)];
  }, []);
};

const getByVisibleName = (arr) => {
  let resp = {};
  arr &&
    arr.length > 0 &&
    arr.map((val) => {
      let key = JSON.stringify(val.visibleName);
      if (!resp[key]) resp[key] = false;
      resp[key] = val.isAccess;
    });
  return resp;
};

export const FetchMenus = (allMastersData) => {
  const linearData = makeLinearArray(allMastersData);
  const linearObj = getByVisibleName(linearData);
  const othersData = [...other];
  const response = makeData(othersData, linearObj, prefixImport);
  return response;
};
