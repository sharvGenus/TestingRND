import { useSelector } from 'react-redux';

export const useFormResponses = () => {
  const formResponseData = useSelector((state) => state.formResponses);
  const secondFormResponseData = useSelector((state) => state.secondFormResponses);
  const formProjectWiseData = useSelector((state) => state.formsProjectWise);
  const formWithRolesData = useSelector((state) => state.formsWithRoles);
  const formWithUsersData = useSelector((state) => state.formsWithUsers);

  return {
    formResponse: formResponseData,
    formProjectWise: formProjectWiseData,
    formWithRoles: formWithRolesData,
    formWithUsers: formWithUsersData,
    secondFormResponse: secondFormResponseData
  };
};
