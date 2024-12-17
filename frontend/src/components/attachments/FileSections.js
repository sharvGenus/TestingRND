import PropTypes from 'prop-types';
import { Suspense, lazy } from 'react';
import Loader from 'components/Loader';

const FileBox = lazy(() => import('components/attachments/FileBox'));
const FilesDisplayModal = lazy(() => import('components/modal/FilesDisplayModal'));

export const preparePayloadForFileUpload = (obj, tasks) => {
  const clonedObject = structuredClone(obj);
  Object.entries(clonedObject).map(([key, value]) => {
    if (!value) return [key, value];
    if (key.includes('-paths')) {
      clonedObject[key] = undefined;
      clonedObject[key.replace('-paths', '')] = [
        ...value,
        ...tasks
          .filter((item) => item.key === key)
          .map((item) => ({ action: item.action, filePath: item.filePath, fileName: item.fileName, fileData: item.fileData }))
      ];
    }
  });
  return clonedObject;
};

const FileSections = ({ view, update, setValue, tasks, setTasks, data, fileFields, disabled }) => {
  return (
    <>
      <Suspense fallback={<></>}>
        {!(view || update) &&
          fileFields.map((item) => (
            <FileBox
              disabled={disabled}
              key={item.name}
              multiple={item.multiple}
              accept={item.accept}
              label={item.label}
              name={item.name}
              setValue={setValue}
            />
          ))}
      </Suspense>

      <Suspense fallback={Loader}>
        {(view || update) && (
          <FilesDisplayModal
            fileFields={fileFields}
            setValue={setValue}
            tasks={tasks}
            setTasks={setTasks}
            data={data}
            update={update}
            view={view}
          />
        )}
      </Suspense>
    </>
  );
};

FileSections.propTypes = {
  view: PropTypes.bool,
  update: PropTypes.bool,
  setValue: PropTypes.func,
  tasks: PropTypes.array,
  setTasks: PropTypes.func,
  data: PropTypes.object,
  fileFields: PropTypes.array,
  disabled: PropTypes.bool
};

export default FileSections;
