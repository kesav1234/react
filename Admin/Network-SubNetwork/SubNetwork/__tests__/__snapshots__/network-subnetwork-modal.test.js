import React, { component } from "react";
import { shallow, mount, render, configure } from "enzyme";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import thunk from "redux-thunk";
import networkSubnetwork from "../network-subnetwork-modal";

/*
const intialState = {
  networkKey: "",
  subNetworkName: "",
  startDate: "",
  endDate: ""
};

*/

/* function render(args) {
  const defaultProps = {
    networkKey,
    subNetworkName,
    startDate,
    endDate,
    onCancel: jest.fn(),
    onSave: jest.fn(),

    match: {}
  };

  const props = { ...defaultProps, ...args };

  return mount(<networkSubnetwork {...props} />);
}

it("sets error when attempting to save an empty network field", () => {
  const wrapper = render();
  wrapper.find("form").simulate("submit");
  const error = wrapper.find(".alert").first();
  expect(error.text()).toBe("networkKey is required.");
});



function renderNetworkSubnetworkForm(args) {
  const defaultProps = {
    networkKey: [],
    subNetworkName: {},
    saving: false,
    formError: {},
    onSave: () => {},
    clear: () => {},
    isValidDate: () => {},
    onDateError: () => {}
  };

  const props = { ...defaultProps, ...args };
  return shallow(<networkSubnetwork {...props} />);
}

it("renders form and header", () => {
  const wrapper = renderNetworkSubnetworkForm();
  console.log(wrapper.debug());
  expect(wrapper.find("form").length).toBe(1);
});

it('labels save buttons as "Save" when not saving', () => {
  const wrapper = renderNetworkSubnetworkForm();
  expect(wrapper.find("button").text()).toBe("Save");
});

it('labels save button as "Saving..." when saving', () => {
  const wrapper = renderNetworkSubnetworkForm({ saving: true });
  expect(wrapper.find("button").text()).toBe("cancel");
});

*/

// <.....Netwok,subNetworkKey,date picker testing.....>

describe("network Subnetwork", () => {
  describe("When store is empty", () => {
    let store;
    const initialState = {
      networkkey: "",
      subNetworkKey: "",

      createRequestErrors: {},
      startDate: "",
      endDate: "",
      onCancel: jest.fn(),
      onSave: jest.fn(),

      searchChangeReducer: {
        allNetworksSubNetworks: []
      }
    };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("snapshot test", () => {
      const wrapper = mount(
        <Provider store={store}>
          <networkSubnetwork />
        </Provider>
      );
      expect(wrapper).toMatchSnapshot();
    });
    it("snapshot test networkSubnetwork", () => {
      const wrapper = mount(
        <Provider store={store}>
          <networkSubnetwork />
        </Provider>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe("When networkKey is available but no network subnetworks", () => {
    let store;
    const initialState = {
      networkKey: 13,
      subNetworkKey: "",

      createRequestErrors: {},
      startDate: "",
      endDate: "",
      onCancel: jest.fn(),
      onSave: jest.fn(),

      searchChangeReducer: {
        allNetworksSubNetworks: []
      }
    };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("snapshot test", () => {
      const wrapper = mount(
        <Provider store={store}>
          <networkSubnetwork />
        </Provider>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe("When store has network list", () => {
    let store;
    const initialState = {
      networkKey: 13,
      subNetworkKey: 936,

      createRequestErrors: {},

      searchChangeReducer: {
        allNetworksSubNetworks: [
          {
            key: 13,
            id: 1,
            name: "DATA",
            description: "DATA",
            startDate: "2020-03-12",
            endDate: "2099-12-31",
            subNetwork: [
              {
                id: 13,
                networkId: 13,
                key: 936,
                name: "CEA/CPA",
                description: "CEA/CPA",
                startDate: "2020-03-12",
                endDate: "2099-12-31"
              }
            ]
          }
        ]
      }
    };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("snapshot test with networks", () => {
      const wrapper = mount(
        <Provider store={store}>
          <networkSubnetwork />
        </Provider>
      );
      expect(wrapper).toMatchSnapshot();
    });
    it("Select networkId", () => {
      const wrapper = mount(
        <Provider store={store}>
          <networkSubnetwork changePlan={""} errors={{}} />
        </Provider>
      );
      const customSelect = wrapper.find("CustomSelect").at(0);
      expect(customSelect.state("showOptions")).toBe(false);
      customSelect
        .find("#select-input-div")
        .at(0)
        .simulate("mouseDown");
      expect(customSelect.state("showOptions")).toBe(true);
      const selectOption = wrapper.find("SelectOption").at(0);
      selectOption
        .find("input")
        .at(1)
        .simulate("change");
      selectOption
        .find(".dropdown-list-item")
        .at(0)
        .simulate("keyDown", { key: "Enter" });
      selectOption
        .find("input")
        .at(1)
        .simulate("change", { target: { checked: false } });
      selectOption
        .find(".dropdown-list-item")
        .at(0)
        .simulate("keyDown", { key: "Enter" });
    });
    it("Select subnetworkId", () => {
      const wrapper = mount(
        <Provider store={store}>
          <networkSubnetwork changePlan={""} errors={{}} />
        </Provider>
      );
      const customSelect = wrapper.find("CustomSelect").at(1);
      expect(customSelect.state("showOptions")).toBe(false);
      customSelect
        .find("#select-input-div")
        .at(0)
        .simulate("mouseDown");
      expect(customSelect.state("showOptions")).toBe(true);
      const selectOption = wrapper.find("SelectOption").at(0);
      selectOption
        .find("input")
        .at(1)
        .simulate("change");
      selectOption
        .find(".dropdown-list-item")
        .at(0)
        .simulate("keyDown", { key: "Enter" });
      selectOption
        .find("input")
        .at(1)
        .simulate("change", { target: { checked: false } });
      selectOption
        .find(".dropdown-list-item")
        .at(0)
        .simulate("keyDown", { key: "Enter" });
    });
  });
});

it("should have proper props for startDate field", () => {
  expect(container.find('DatePicker[name={"startDate"}]').props()).toEqual({
    className: "form-group",
    onChange: expect.any(Function),
    autocomplete: "off"
  });
});

describe("When date has empty", () => {
  let store;
  const initialState = {
    onChange: jest.fn(),
    dateFormat: true,
    timeFormat: false
  };
  beforeEach(() => {
    const mockStore = configureStore([thunk]);
    store = mockStore(initialState);
  });
  it("snapshot test", () => {
    const wrapper = mount(
      <Provider store={store}>
        <networkSubnetwork />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

let wrapper;
beforeEach(() => {
  wrapper = mount(<networkSubnetwork />);
});

const intialState = {
  networkId: "",
  name: "",
  startDate: "",
  endDate: "",
  result: jest.fn(),
  dispatch: jest.fn()
};

test("render a submitt button with text of `save`", () => {
  expect(wrapper.find(".btn request-btn").toBe("save"));
});

test("render the click event of submitt button and save the value", () => {
  wrapper
    .find(".btn request-btn")
    .at(0)
    .simulate("click");
  expect(wrapper.find(".col-md-12 col-lg-3").text()).toBe(intialState);
});

test("render the click event of cancel button and cancel the value", () => {
  wrapper
    .find(".btn clear-btn")
    .at(0)
    .simulate("click");
  expect(wrapper.find(".btn clear-btn").text()).toBe(intialState);
});

it("should set the network value on change event with trim", () => {
  container.find('CustomSelect[name={"network"}]').simulate("change", {
    target: {
      defaultValue: "test",
      onChange: true
    }
  });
  expect(
    container.find('CustomSelect[name={"network"}]').prop("defaultValue")
  ).toEqual("test");
});

it("should call the dispatch function and disable the submit button on button click", () => {
  container.find('Button[title="Submit"]').simulate("click");
  expect(
    container.find('Button[title="Submit"]').prop("disabled")
  ).toBeTruthy();
  expect(initialProps.dispatch).toHaveBeenCalledTimes(1);
});
