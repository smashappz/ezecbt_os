import React, { Component } from "react";
import { AppState, Modal } from "react-native";
import PINCode, { hasUserSetPinCode } from "@haskkor/react-native-pincode";
import SplashScreen from "react-native-splash-screen";
import CBTApp from "./src/Cbt";
import { cbtRef, getData, ThemeContext, themes } from "./src/utils";
import i18n from "./src/i18n";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPin: false,
      theme: themes.light,
      toggleTheme: () =>
        this.setState(state => ({
          theme: state.theme === themes.dark ? themes.light : themes.dark
        }))
    };
  }

  async componentDidMount() {
    AppState.addEventListener("change", state => {
      if (state !== "background") {
        return;
      }

      const _this_ = this;

      hasUserSetPinCode().then(showPin => {
        if (!showPin) {
          return;
        }

        this.setState({
          showPin: true
        });
      });
    });

    getData("darkMode", darkMode => {
      this.setState({
        theme: darkMode === "true" ? themes.dark : themes.light
      });
    });

    hasUserSetPinCode().then(showPin => {
      this.setState({
        showPin
      });

      SplashScreen.hide();
    });
  }

  finishProcess = pinCode => {
    this.setState({
      showPin: false
    });
  };

  render() {
    const { showPin } = this.state;

    return (
      <ThemeContext.Provider value={this.state}>
        <CBTApp ref={cbtRef} />
        <Modal animationType="slide" transparent={false} visible={showPin}>
          <PINCode
            finishProcess={this.finishProcess}
            status={"enter"}
            subtitleError={i18n.t("pin.subtitle")}
            touchIDDisabled={true}
            titleAttemptFailed={i18n.t("pin.failed")}
            titleChoose={i18n.t("pin.enter")}
          />
        </Modal>
      </ThemeContext.Provider>
    );
  }
}

export default App;
