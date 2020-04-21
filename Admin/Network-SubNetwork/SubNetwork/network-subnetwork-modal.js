import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import _ from "lodash";
import { DatePicker } from "../../../../app/atoms";
import CategoryNameWrapper from "../../category-name-wrapper";
import CustomSelect from "../../../../app/molecules/CustomSelect";
import Button from "../../../../app/atoms/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { getAllNetworksSubNetworks } from "../../../SearchChangeRequest/redux/actionCreators";
import ValidateForm from "../../ValidateForm/validate-form";
import {
  formErrors,
  saveNetworkSubNetwork,
  getAllSubNetworkAssociations
} from "../../redux/actionCreators";

const NetworkSubnetworkModal = ({ mode, close }) => {
  const { formError, userName, loading } = useSelector(state => {
    return {
      formError: state.adminData.formError,
      userName: state.access.user.name,
      loading: state.adminData.loading
    };
  });

  const { networkSubNetworks, subNetworkAssociations } = useSelector(state => {
    return {
      networkSubNetworks: state.searchChangeReducer.allNetworksSubNetworks,
      subNetworkAssociations: state.adminData.subNetworkAssociations
    };
  });

  const dispatch = useDispatch();
  const [form, setForm] = useState({
    networkId: "",
    name: "",
    startDate: "",
    endDate: ""
  });
  const [clear, setClear] = useState(false);
  const [associationError, setAssociationError] = useState(false);
  const defaultStartDate = moment().subtract(1, "days");

  const isGreaterThanToday = current => {
    return current.isAfter(defaultStartDate);
  };

  const endDateValid = current => {
    return isGreaterThanToday(current) && current.isAfter(form.startDate);
  };

  useEffect(
    () => {
      setClear(false);
    },
    [mode]
  );

  useEffect(
    () => {
      if (!networkSubNetworks || networkSubNetworks.length === 0) {
        dispatch(getAllNetworksSubNetworks());
      }
    },
    [networkSubNetworks]
  );

  const setFormFieldValue = (key, value) => {
    setForm({
      ...form,
      [key]: value
    });
  };

  const checkForDuplicateAssociations = (networkId, name) => {
    const associations = subNetworkAssociations.find(item => {
      return (
        item.networks[0] &&
        item.networks[0].id === networkId &&
        item.name === name.trim()
      );
    });
    if (associations) {
      setAssociationError(true);
    } else {
      setAssociationError(false);
    }
  };
  useEffect(
    () => {
      console.log("check for duplicate");
      if (form.networkId && form.name) {
        checkForDuplicateAssociations(form.networkId, form.name);
      }
    },
    [form.networkId, form.name]
  );

  const handleSubNetworkNameChange = evt => {
    setFormFieldValue("name", evt.target.value);
  };

  const onNetworkChange = (evt, selectedOption, item) => {
    setFormFieldValue(
      "networkId",
      selectedOption != null ? selectedOption.id : undefined
    );
  };

  const toggleOptions = name => {};

  const onSave = () => {
    var result = ValidateForm(form);
    if (result.isValid) {
      //Call api to save
      dispatch(
        saveNetworkSubNetwork(
          [
            {
              ...form,
              name: form.name.trim(),
              createdBy: userName,
              startDate: moment(form.startDate, "MM/DD/YYYY").format(
                "YYYY-MM-DDT00:00:00"
              ),
              endDate: moment(form.endDate, "MM/DD/YYYY").format(
                "YYYY-MM-DDT00:00:00"
              )
            }
          ],
          () => {
            close();
            onCancel();
            setAssociationError(false);
          }
        )
      );
      dispatch(formErrors({}));
    } else {
      dispatch(formErrors(result.formErrors));
    }
  };

  const onCancel = () => {
    setForm({
      networkId: "",
      name: "",
      startDate: "",
      endDate: ""
    });
    setClear(true);
    dispatch(formErrors({}));
    setAssociationError(false);
    close();
  };
  return (
    <div className="row ">
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-6 need-validated">
            <CustomSelect
              name={"network"}
              label={"Network *"}
              disabled={false}
              required={true}
              tabIndex="0"
              clear={clear}
              defaultValue={form.networkId}
              options={networkSubNetworks}
              onChange={onNetworkChange}
              toggleOptions={toggleOptions}
              error={formError.networkId}
              errorMessage={formError.networkId}
            />
          </div>
          <div className="col-md-6">
            <div className="need-validated activityCategory">
              <CategoryNameWrapper
                label="Sub-Network Name *"
                value={form.name}
                clear={clear}
                error={formError.name}
                errorMessage={formError.name}
                onChange={handleSubNetworkNameChange}
              />
            </div>
          </div>
        </div>
        {associationError && (
          <div className="row">
            <div className="col-md-12 form-group" style={{ color: "red" }}>
              Error: Association already exists
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <DatePicker
                onChange={val => {
                  setFormFieldValue("startDate", val);
                }}
                name={"startDate"}
                label={"Start Date *"}
                dateFormat={true}
                timeFormat={false}
                required={true}
                defaultValue={form.startDate}
                isValidDate={isGreaterThanToday}
                value={form.startDate}
                dispConflicts="form-control"
                minDate={new Date()}
                autocomplete="off"
                error={formError.startDate}
                errorMessage={formError.startDate}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <DatePicker
                onChange={val => {
                  setFormFieldValue("endDate", val);
                }}
                name={"endDate"}
                label={"End Date *"}
                dateFormat={true}
                timeFormat={false}
                required={true}
                startDate={form.startDate}
                isValidDate={endDateValid}
                value={form.endDate}
                dispConflicts="form-control"
                minDate={new Date()}
                autocomplete="off"
                error={formError.starDate}
                errorMessage={formError.startDate}
              />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: "10px" }}>
          <div className="col-md-12 col-lg-3">
            <Button
              title="Submit"
              className="btn request-btn"
              disabled={associationError}
              onClick={onSave}
            />
          </div>
          <div className="col-md-12 col-lg-2" style={{ padding: "0px" }}>
            <Button
              title="Cancel"
              className="btn clear-btn"
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSubnetworkModal;
