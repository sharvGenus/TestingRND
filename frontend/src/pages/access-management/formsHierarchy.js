import { DownOutlined, RightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Grid, Typography, styled } from '@mui/material';

const StyleAction = styled('div')(() => ({
  marginLeft: -10,
  paddingLeft: 10,
  paddingTop: 5,
  paddingBottom: 5,
  cursor: 'pointer',
  ':hover': {
    background: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 5
  }
}));

const Actions = ({ setShowHide, onClickForm, level, val, selected, setSelected }) => {
  const [show, setShow] = useState(false);

  const handleShow = (bl) => {
    setShow(bl);
    setShowHide(bl);
  };
  return (
    <StyleAction
      style={{ marginTop: 5 }}
      onClick={() => {
        handleShow(!show);
        if (val && !val.child) {
          onClickForm(val);
          setSelected(val.name);
        }
      }}
    >
      <Grid container spacing={1} pl={0.1} pt={0.3} pb={0.3}>
        {level > 0 && (
          <Grid item xs={1}>
            &nbsp;&nbsp;
          </Grid>
        )}
        <Grid item xs={1}>
          {val && val.child && val.child.length > 0 && <>{show ? <DownOutlined /> : <RightOutlined />}</>}
        </Grid>
        <Grid item xs={10}>
          <Typography
            sx={{
              color: level == 2 ? 'purple' : level == 1 ? 'green' : 'blue',
              fontWeight: selected === val.name ? 700 : 400
            }}
          >
            {val.name}
          </Typography>
        </Grid>
      </Grid>
    </StyleAction>
  );
};

Actions.propTypes = {
  setShowHide: PropTypes.func,
  val: PropTypes.any,
  onClickForm: PropTypes.func,
  selected: PropTypes.string,
  setSelected: PropTypes.func,
  level: PropTypes.number
};

const ChildAccordion = ({ val, onClickForm, level, selected, setSelected }) => {
  const [showHide, setShowHide] = useState(false);
  return (
    <>
      <Actions
        setShowHide={setShowHide}
        val={val}
        level={level}
        selected={selected}
        setSelected={setSelected}
        onClickForm={() => {
          if (val && !val.child) {
            onClickForm(val);
            setSelected(val.name);
          }
        }}
      />
      {showHide && (
        <AccordionData data={val.child} onClickForm={onClickForm} level={level + 1} selected={selected} setSelected={setSelected} />
      )}
    </>
  );
};

ChildAccordion.propTypes = {
  val: PropTypes.any,
  onClickForm: PropTypes.func,
  level: PropTypes.number,
  selected: PropTypes.string,
  setSelected: PropTypes.func
};

const AccordionData = ({ data, onClickForm, level, selected, setSelected }) => {
  return (
    <>
      {data &&
        data.length > 0 &&
        data.map((val) => (
          <>
            {val && val.id && (
              <ChildAccordion
                key={val?.id}
                val={val}
                level={level}
                onClickForm={onClickForm}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </>
        ))}
    </>
  );
};

AccordionData.propTypes = {
  data: PropTypes.array,
  onClickForm: PropTypes.func,
  level: PropTypes.number,
  selected: PropTypes.string,
  setSelected: PropTypes.func
};

const FormsHierarchy = ({ data, showFormDetails }) => {
  const [revData, setRevData] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setRevData(data);
  }, [data]);

  const onClickForm = (val) => {
    showFormDetails(val.id, val.name);
  };

  return (
    <>
      <AccordionData data={revData} onClickForm={onClickForm} level={0} selected={selected} setSelected={setSelected} />
    </>
  );
};

FormsHierarchy.propTypes = {
  data: PropTypes.array,
  showFormDetails: PropTypes.func
};

export default FormsHierarchy;
