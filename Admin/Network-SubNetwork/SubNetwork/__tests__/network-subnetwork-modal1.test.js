import React from "react";
import { mount } from "enzyme";
import NetworkSubnetworkModal from "../network-subnetwork-modal";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";

describe("Network subnetworkModal", () => {
  describe("When store is empty", () => {
    let store;
    const initialState = {
      searchChangeReducer: {
        allNetworksSubNetworks: []
      },
      adminData: {
        subNetworkAssociations: {
          subNetworkAssociations: []
        },
        formError: {
          formError: ""
        },
        loading: {
          loading: false
        }
      },
      access: {
        user: {
          name: ""
        }
      }
    };

    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("snapshot test", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider store={store}>
            <NetworkSubnetworkModal />
          </Provider>
        </BrowserRouter>
      );
      expect(wrapper).toMatchSnapshot();
    });
    it("snapshot test network wrapper", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider store={store}>
            <NetworkSubnetworkModal
              subNetworkAssociations={""}
              formError={{}}
              loading="false"
              user={{ userName: "" }}
            />
          </Provider>
        </BrowserRouter>
      );
      expect(wrapper).toMatchSnapshot();
    });
    it("snapshot test network wrapper with datepicker is endDateValid", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider store={store}>
            <NetworkSubnetworkModal
              subNetworkAssociations={""}
              formError={{}}
              loading={""}
              user={{ userName: "" }}
              endDateValid="21/04/2020"
            />
          </Provider>
        </BrowserRouter>
      );
      expect(wrapper).toMatchSnapshot();
    });
    it("snapshot test", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider const store={store}>
            <NetworkSubnetworkModal />
          </Provider>
        </BrowserRouter>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("When allNetworksSubNetworks is available but no subnetworksAssociations", () => {
    let store;
    const initialState = {
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
      },
      adminData: {
        subNetworkAssociations: {
          subNetworkAssociations: []
        },
        formError: {
          formError: ""
        },
        loading: {
          loading: false
        }
      },
      access: {
        user: {
          name: ""
        }
      }
    };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("Select network", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider const store={store}>
            <NetworkSubnetworkModal
              subNetworkAssociations={""}
              formError={{}}
              loading="false"
              user={{ name: "" }}
            />
          </Provider>
        </BrowserRouter>
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
  });

  describe("When allNetworksSubNetworks is available and  subnetworksAssociations", () => {
    let store;
    const initialState = {
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
      },
      adminData: {
        subNetworkAssociations: {
          subNetworkAssociations: [
            {
              id: 13,
              networkId: 13,
              key: 936,
              name: "CEA/CPA",
              description: "CEA/CPA",
              startDate: "2020-03-12",
              endDate: "2099-12-31"
            },
            {
              id: 14,
              networkId: 14,
              key: 937,
              name: "CEW/CPAQ",
              description: "CEA/CPA",
              startDate: "2020-03-12",
              endDate: "2099-12-31"
            }
          ]
        },
        formError: {
          formError: ""
        },
        loading: {
          loading: false
        }
      },
      access: {
        user: {
          name: ""
        }
      }
    };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("Select subnetworkAssociations", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider const store={store}>
            <NetworkSubnetworkModal
              subNetworkAssociations={"() => {}"}
              formError={{}}
              loading="false"
              user={{ name: "" }}
            />
          </Provider>
        </BrowserRouter>
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
  });

  describe("When allNetworksSubNetworks is available with duplicate subnetworksAssociations", () => {
    let store;
    const initialState = {
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
      },
      adminData: {
        subNetworkAssociations: {
          subNetworkAssociations: [
            {
              id: 13,
              networkId: 13,
              key: 936,
              name: "CEA/CPA",
              description: "CEA/CPA",
              startDate: "2020-03-12",
              endDate: "2099-12-31"
            },
            {
              id: 13,
              networkId: 13,
              key: 936,
              name: "CEA/CPA",
              description: "CEA/CPA",
              startDate: "2020-03-14",
              endDate: "2099-12-29"
            }
          ]
        },
        formError: {
          formError: ""
        },
        loading: {
          loading: false
        }
      },
      access: {
        user: {
          name: ""
        }
      }
    };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("Select subnetworkAssociations", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider const store={store}>
            <NetworkSubnetworkModal
              subNetworkAssociations={"() => {}"}
              checkForDuplicateAssociations={(networkId, name) => {
                "";
              }}
              formError={{}}
              loading="false"
              user={{ name: "" }}
            />
          </Provider>
        </BrowserRouter>
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
  });

  describe("When user click on submitt button", () => {
    let store;
    const initialState = {
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
      },
      adminData: {
        subNetworkAssociations: {
          subNetworkAssociations: [
            {
              id: 13,
              networkId: 13,
              key: 936,
              name: "CEA/CPA",
              description: "CEA/CPA",
              startDate: "2020-03-12",
              endDate: "2099-12-31"
            },
            {
              id: 13,
              networkId: 13,
              key: 936,
              name: "CEA/CPA",
              description: "CEA/CPA",
              startDate: "2020-03-14",
              endDate: "2099-12-29"
            }
          ]
        },
        formError: {
          formError: ""
        },
        loading: {
          loading: false
        }
      },
      access: {
        user: {
          name: "chinke8"
        }
      },
      onClick: jest.fn()
    };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore(initialState);
    });
    it("Select subnetworkAssociations", () => {
      const wrapper = mount(
        <BrowserRouter>
          <Provider const store={store}>
            <NetworkSubnetworkModal
              subNetworkAssociations={"() => {}"}
              checkForDuplicateAssociations={(networkId, name) => {
                "";
              }}
              formError={{}}
              loading="false"
              user={{ name: "" }}
              onClick={jest.fn()}
            />
          </Provider>
        </BrowserRouter>
      );
      expect(wrapper.find(".btn request-btn").length).toEqual(1);

      wrapper.find("Button").simulate("click");
      expect(wrapper.find(".btn request-btn").length).toEqual(1);
    });
  });
});
