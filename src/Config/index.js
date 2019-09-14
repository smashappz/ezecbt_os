import React, { Component } from "react";
import { Modal, Switch, TouchableNativeFeedback, View } from "react-native";
import date from "date-and-time";
import Dialog from "react-native-dialog";
import RNFS from "react-native-fs";
import FilePickerManager from "react-native-file-picker";
import Icon from "react-native-vector-icons/Ionicons";
import Permissions from "react-native-permissions";
import PINCode, {
  deleteUserPinCode,
  hasUserSetPinCode
} from "@haskkor/react-native-pincode";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import i18n from "../i18n";
import RNAdConsent from "react-native-ad-consent";
import { zip, unzip } from "react-native-zip-archive";
import {
  SwitchButton,
  SwitchLeft,
  SwitchRight,
  SwitchText,
  SwitchView
} from "./styles";
import {
  APP_NAME,
  browser,
  cbtRef,
  DB_NAME,
  DOWNLOAD,
  getData,
  getDB,
  getDBPath,
  PLAY_URL,
  setData,
  Settings,
  ThemeContext,
  themes,
  trendsRef
} from "../utils";

class Config extends Component {
  state = {
    archive: "",
    backupDialog: false,
    backingUp: false,
    darkMode: this.context.theme === themes.dark,
    deleteDialog: false,
    deletePin: false,
    incremental: Settings.incremental,
    lastBackup: "",
    modalVisible: false,
    pieChart: Settings.pieChart,
    pinSet: false,
    pinStatus: "choose",
    restoreDialog: false,
    restorePath: "",
    restoreWarnDialog: false,
    storage: false
  };

  async componentDidMount() {
    Permissions.check("storage").then(response => {
      this.setState({ storagePermission: response });
    });

    getData("lastBackup", lastBackup => {
      this.setState({
        lastBackup
      });
    });

    hasUserSetPinCode().then(pinSet => {
      this.setState({
        pinSet
      });
    });
  }

  backupOK = () => {
    this.setState({
      backupDialog: false
    });
  };

  deleteCancel = () => {
    this.setState({
      deleteDialog: false,
      deletePin: false
    });
  };

  deleteOK = () => {
    deleteUserPinCode();
    this.setState({
      deleteDialog: false,
      deletePin: false,
      pinSet: false
    });
  };

  filePicker = callback => {
    FilePickerManager.showFilePicker(null, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        callback(response);
      }
    });
  };

  finishPin = pinCode => {
    const { deletePin, pinStatus } = this.state;

    switch (pinStatus) {
      case "choose":
        hasUserSetPinCode().then(pinSet => {
          this.setState({
            modalVisible: false,
            pinSet
          });
        });
        break;

      case "enter":
        if (deletePin) {
          this.setState({
            deleteDialog: true,
            modalVisible: false
          });
        } else {
          this.setState({
            pinStatus: "choose"
          });
        }
        break;

      default:
    }
  };

  onBackup = () => {
    const { backingUp } = this.state;

    if (backingUp) {
      return;
    }

    this.requestStorageAccess(() => {
      try {
        const { incremental } = this.state;
        const ts = new Date().getTime().toString();
        const target_name = APP_NAME + (incremental ? "_" + ts : "") + ".zip";
        const target = DOWNLOAD + target_name;

        this.setState({
          backingUp: true
        });

        zip(getDB(), target)
          .then(path => {
            this.setState({
              archive: target_name,
              backupDialog: true,
              backingUp: false,
              lastBackup: ts
            });
            setData("lastBackup", ts);
          })
          .catch(e => {
            this.setState({
              backingUp: false
            });
          });
      } catch (e) {}
    });
  };

  onCancelPin = () => {
    this.setState({
      deletePin: false,
      modalVisible: false
    });
  };

  onChangeAds = () => {
    cbtRef.current.setModal1Visible(true);
  };

  onChangeAds2 = () => {
    cbtRef.current.setModal2Visible(true);
  };

  onChangeDarkMode = () => {
    const { toggleTheme } = this.context;
    toggleTheme();

    this.setState(state => ({
      darkMode: !state.darkMode
    }));

    setData("darkMode", (!this.state.darkMode).toString());
  };

  onChangeIncremental = () => {
    this.setState(state => ({
      incremental: !state.incremental
    }));

    setData("incremental", (!this.state.incremental).toString());
  };

  onChangePieChart = () => {
    const pieChart = !this.state.pieChart;

    this.setState(state => ({
      pieChart: !state.pieChart
    }));

    setData("pieChart", pieChart.toString());
    Settings.pieChart = pieChart;

    trendsRef.current.getPieData();
  };

  onDeletePin = () => {
    this.setState({
      deletePin: true,
      modalVisible: true,
      pinStatus: "enter"
    });
  };

  onRestore = () => {
    this.requestStorageAccess(() => {
      this.filePicker(src => {
        if (!src || !src.path) {
          return;
        }

        this.setState({
          restorePath: src.path,
          restoreWarnDialog: true
        });
      });
    });
  };

  onSetPin = () => {
    const { pinSet } = this.state;

    this.setState({
      modalVisible: true,
      pinStatus: pinSet ? "enter" : "choose"
    });
  };

  requestStorageAccess = callback => {
    const { storagePermission } = this.state;

    if (storagePermission === "authorized") {
      callback();
    } else {
      Permissions.request("storage", {
        rationale: {
          message: i18n.t("config.requestStorageAccess_msg"),
          title: i18n.t("config.requestStorageAccess_title")
        }
      }).then(response => {
        this.setState({ storagePermission: response });

        if (response === "authorized") {
          callback();
        }
      });
    }
  };

  restoreOK = () => {
    this.setState({
      restoreDialog: false
    });
  };

  restoreWarnCancel = () => {
    this.setState({
      restoreWarnDialog: false
    });
  };

  restoreWarnOK = () => {
    const { restorePath } = this.state;
    this.restoreWarnCancel();

    try {
      unzip(restorePath, getDBPath(), "UTF-8")
        .then(path => {
          if (
            restorePath.includes(APP_NAME) &&
            DB_NAME.startsWith("watermelon")
          ) {
            RNFS.moveFile(getDBPath() + APP_NAME + ".db", getDB())
              .then(() => {})
              .catch(err => {});
          }

          this.setState({
            restoreDialog: true,
            restorePath: ""
          });
        })
        .catch(e => {});
    } catch (e) {}
  };

  render() {
    const {
      archive,
      backupDialog,
      backingUp,
      darkMode,
      deleteDialog,
      incremental,
      lastBackup,
      pieChart,
      pinSet,
      pinStatus,
      restoreDialog,
      restoreWarnDialog
    } = this.state;
    const { theme } = this.context;
    const { backgroundColor, borderColor, color } = theme;

    const backupDesc = i18n.t("config.backupDesc", { archive });

    const backupText = backingUp
      ? i18n.t("config.backupText_true") + "..."
      : i18n.t("config.backupText_false", {
          text: lastBackup
            ? i18n.t("config.backupText_false_text") +
              date.format(
                new Date(Number(lastBackup)),
                "ddd, D MMM YYYY  h:mm A"
              ) +
              ")"
            : ""
        });

    const consent =
      Settings.consentStatus === RNAdConsent.PERSONALIZED
        ? i18n.t("config.consent_yes")
        : i18n.t("config.consent_no");

    return (
      <View
        style={{
          backgroundColor,
          padding: wp(4.4)
        }}
      >
        <View style={{ borderColor, borderBottomWidth: 1, padding: wp(4.8) }}>
          <View style={{ alignItems: "center", flex: 1, flexDirection: "row" }}>
            <Icon
              name="md-folder"
              size={wp(6.7)}
              style={{ color, paddingRight: 11 }}
            />
            <SwitchText theme={theme}>{backupText}</SwitchText>
          </View>
          <View
            style={{
              alignItems: "center",
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingTop: wp(2.2)
            }}
          >
            <TouchableNativeFeedback onPress={this.onBackup}>
              <SwitchButton>&nbsp;{i18n.t("config.backup")}&nbsp;</SwitchButton>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={this.onRestore}>
              <SwitchButton>
                &nbsp;{i18n.t("config.restore")}&nbsp;
              </SwitchButton>
            </TouchableNativeFeedback>
          </View>
        </View>
        <SwitchView theme={theme}>
          <SwitchLeft>
            <View
              style={{ alignItems: "center", flex: 1, flexDirection: "row" }}
            >
              <Icon
                name="md-moon"
                size={wp(6.7)}
                style={{ color, paddingRight: 12 }}
              />
              <SwitchText theme={theme}>{i18n.t("config.darkMode")}</SwitchText>
            </View>
          </SwitchLeft>
          <SwitchRight>
            <Switch onValueChange={this.onChangeDarkMode} value={darkMode} />
          </SwitchRight>
        </SwitchView>
        <SwitchView theme={theme}>
          <SwitchLeft>
            <View
              style={{ alignItems: "center", flex: 1, flexDirection: "row" }}
            >
              <Icon
                name="md-add"
                size={wp(6.7)}
                style={{ color, paddingRight: 16 }}
              />
              <SwitchText theme={theme}>
                {i18n.t("config.incremental")}
              </SwitchText>
            </View>
          </SwitchLeft>
          <SwitchRight>
            <Switch
              onValueChange={this.onChangeIncremental}
              value={incremental}
            />
          </SwitchRight>
        </SwitchView>
        <SwitchView theme={theme}>
          <TouchableNativeFeedback onPress={() => browser(PLAY_URL)}>
            <View
              style={{ alignItems: "center", flex: 1, flexDirection: "row" }}
            >
              <Icon
                name="md-star"
                size={wp(6.7)}
                style={{ color, paddingRight: 12 }}
              />
              <SwitchText theme={theme}>{i18n.t("config.rating")}</SwitchText>
            </View>
          </TouchableNativeFeedback>
        </SwitchView>
        <View style={{ borderColor, borderBottomWidth: 1, padding: wp(4.8) }}>
          <View style={{ alignItems: "center", flex: 1, flexDirection: "row" }}>
            <Icon
              name="md-lock"
              size={wp(6.7)}
              style={{ color, paddingRight: 16 }}
            />
            <SwitchText theme={theme}>{i18n.t("config.pinLock")}</SwitchText>
          </View>
          <View
            style={{
              alignItems: "center",
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingTop: wp(2.2)
            }}
          >
            <TouchableNativeFeedback onPress={this.onSetPin}>
              <SwitchButton>
                &nbsp;
                {pinSet ? i18n.t("config.pinChange") : i18n.t("config.pinSet")}
                &nbsp;
              </SwitchButton>
            </TouchableNativeFeedback>
            {pinSet && (
              <TouchableNativeFeedback onPress={this.onDeletePin}>
                <SwitchButton>
                  &nbsp;{i18n.t("config.pinRemove")}&nbsp;
                </SwitchButton>
              </TouchableNativeFeedback>
            )}
          </View>
        </View>
        {Settings.isRequestLocationInEeaOrUnknown && (
          <View style={{ borderColor, borderBottomWidth: 1, padding: wp(4.8) }}>
            <View
              style={{ alignItems: "center", flex: 1, flexDirection: "row" }}
            >
              <Icon
                name="md-easel"
                size={wp(6.7)}
                style={{ color, paddingRight: 10 }}
              />
              <SwitchText theme={theme}>{consent}</SwitchText>
            </View>
            <View
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingTop: wp(2.2)
              }}
            >
              <TouchableNativeFeedback onPress={this.onChangeAds}>
                <SwitchButton>
                  &nbsp;{i18n.t("config.consentChange")}&nbsp;
                </SwitchButton>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={this.onChangeAds2}>
                <SwitchButton>
                  &nbsp;{i18n.t("config.consentProviders")}&nbsp;
                </SwitchButton>
              </TouchableNativeFeedback>
            </View>
          </View>
        )}
        <SwitchView theme={theme}>
          <TouchableNativeFeedback
            onPress={() =>
              browser("mailto:support@smashappz.com?subject=Feedback on ezeCBT")
            }
          >
            <View
              style={{ alignItems: "center", flex: 1, flexDirection: "row" }}
            >
              <Icon
                name="md-mail"
                size={wp(6.7)}
                style={{ color, paddingRight: 8 }}
              />
              <SwitchText theme={theme}>{i18n.t("config.feedback")}</SwitchText>
            </View>
          </TouchableNativeFeedback>
        </SwitchView>
        <SwitchView theme={theme}>
          <SwitchLeft>
            <View
              style={{ alignItems: "center", flex: 1, flexDirection: "row" }}
            >
              <Icon
                name="md-pie"
                size={wp(6.7)}
                style={{ color, paddingRight: 8 }}
              />
              <SwitchText theme={theme}>{i18n.t("config.pieChart")}</SwitchText>
            </View>
          </SwitchLeft>
          <SwitchRight>
            <Switch onValueChange={this.onChangePieChart} value={pieChart} />
          </SwitchRight>
        </SwitchView>
        <Dialog.Container visible={backupDialog}>
          <Dialog.Title>{i18n.t("dialog.titleBackup")}</Dialog.Title>
          <Dialog.Description>{backupDesc}</Dialog.Description>
          <Dialog.Button
            label={i18n.t("dialog.btnOk")}
            onPress={this.backupOK}
          />
        </Dialog.Container>
        <Dialog.Container visible={deleteDialog}>
          <Dialog.Title>{i18n.t("dialog.titlePincode")}</Dialog.Title>
          <Dialog.Description>
            {i18n.t("dialog.descPincode")}
          </Dialog.Description>
          <Dialog.Button
            label={i18n.t("dialog.btnCancel")}
            onPress={this.deleteCancel}
          />
          <Dialog.Button
            label={i18n.t("dialog.btnRemove")}
            onPress={this.deleteOK}
          />
        </Dialog.Container>
        <Dialog.Container visible={restoreDialog}>
          <Dialog.Title>{i18n.t("dialog.titleRestore")}</Dialog.Title>
          <Dialog.Description>
            {i18n.t("dialog.descRestore")}
          </Dialog.Description>
          <Dialog.Button
            label={i18n.t("dialog.btnOk")}
            onPress={this.restoreOK}
          />
        </Dialog.Container>
        <Dialog.Container visible={restoreWarnDialog}>
          <Dialog.Title>{i18n.t("dialog.titleUndone")}</Dialog.Title>
          <Dialog.Description>
            {i18n.t("dialog.descOverwrite")}
          </Dialog.Description>
          <Dialog.Button
            label={i18n.t("dialog.btnCancel")}
            onPress={this.restoreWarnCancel}
          />
          <Dialog.Button
            label={i18n.t("dialog.btnOverwrite")}
            onPress={this.restoreWarnOK}
          />
        </Dialog.Container>
        <Modal
          animationType="slide"
          onRequestClose={this.onCancelPin}
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={{}}>
            <TouchableNativeFeedback onPress={this.onCancelPin}>
              <Icon
                name="md-close"
                size={wp(6.7)}
                style={{ paddingLeft: wp(2.2) }}
              />
            </TouchableNativeFeedback>
          </View>
          <PINCode
            finishProcess={this.finishPin}
            status={pinStatus}
            touchIDDisabled={true}
          />
        </Modal>
      </View>
    );
  }
}

Config.contextType = ThemeContext;

export default Config;

// adb shell
// run-as com.smashappz.ezecbt
