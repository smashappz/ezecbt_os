import React, { Component } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import i18n from "../i18n";
import { browser, ThemeContext } from "../utils";

class Help extends Component {
  state = {
    screen: 0
  };

  showScreen = screen => {
    this.setState({
      screen
    });
  };

  render() {
    const { screen } = this.state;
    const { theme } = this.context;
    const { backgroundColor, borderColor, color, link } = theme;

    let showScreen;

    switch (screen) {
      case 1:
        showScreen = SCREEN_1(color, link);
        break;

      case 2:
        showScreen = SCREEN_2(color, link);
        break;

      case 3:
        showScreen = SCREEN_3(color, link);
        break;

      case 4:
        showScreen = SCREEN_4(color, link);
        break;

      case 5:
        showScreen = SCREEN_5(color, link);
        break;

      default:
        showScreen = SCREEN_0(color, link);
    }

    return (
      <View
        style={{
          backgroundColor
        }}
      >
        <View
          style={{
            borderColor,
            borderBottomWidth: 1,
            padding: wp(5)
          }}
        >
          <TouchableNativeFeedback onPress={() => this.showScreen(0)}>
            <Text style={{ color: link }}>
              • {i18n.t("help.link1")}
              {"\n"}
            </Text>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.showScreen(1)}>
            <Text style={{ color: link }}>
              • {i18n.t("help.link2")}
              {"\n"}
            </Text>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.showScreen(2)}>
            <Text style={{ color: link }}>
              • {i18n.t("help.link3")}
              {"\n"}
            </Text>
          </TouchableNativeFeedback>
          <View style={{ marginVertical: 8 }} />
          <TouchableNativeFeedback onPress={() => this.showScreen(3)}>
            <Text style={{ color: link }}>
              • {i18n.t("help.link4")}
              {"\n"}
            </Text>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.showScreen(4)}>
            <Text style={{ color: link }}>
              • {i18n.t("help.link5")}
              {"\n"}
            </Text>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.showScreen(5)}>
            <Text style={{ color: link }}>
              • {i18n.t("help.link6")}
              {"\n"}
            </Text>
          </TouchableNativeFeedback>
        </View>
        <View
          style={{
            padding: wp(5),
            paddingTop: wp(6.7)
          }}
        >
          {showScreen}
        </View>
      </View>
    );
  }
}

const SCREEN_0 = (color, link) => (
  <View>
    <Text style={{ color, fontSize: wp(5), fontWeight: "bold" }}>
      {i18n.t("help.scr_0_0")}
      {"\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_0_1")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_0_2")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_0_3")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_0_4")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_0_5")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_0_6")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_0_7")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_0_8_0")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_0_8_1")}</Text>
      {i18n.t("help.scr_0_8_2")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_0_8_3")}</Text>
      {i18n.t("help.scr_0_8_4")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_0_8_5")}</Text>
      {i18n.t("help.scr_0_8_6")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_0_8_7")}</Text>
      {i18n.t("help.scr_0_8_8")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_0_9")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_0_10")}
      {"\n"}
    </Text>
    <TouchableNativeFeedback
      onPress={() =>
        browser(
          "https://www.nhs.uk/conditions/cognitive-behavioural-therapy-cbt"
        )
      }
    >
      <Text style={{ color: link, fontStyle: "italic" }}>
        {i18n.t("help.source")}
        https://www.nhs.uk/conditions/cognitive-behavioural-therapy-cbt/)
        {"\n\n"}
      </Text>
    </TouchableNativeFeedback>
  </View>
);

const SCREEN_1 = (color, link) => (
  <View>
    <Text style={{ color, fontSize: wp(5), fontWeight: "bold" }}>
      {i18n.t("help.scr_1_0")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_1_1")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_1_2")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_1_3")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_1_4")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_1_5")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_1")}</Text>
      {i18n.t("help.scr_1_5_2")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_3")}</Text>
      {i18n.t("help.scr_1_5_4")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_5")}</Text>
      {i18n.t("help.scr_1_5_6")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_7")}</Text>
      {i18n.t("help.scr_1_5_8")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_9")}</Text>
      {i18n.t("help.scr_1_5_10")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_11")}</Text>
      {i18n.t("help.scr_1_5_12")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_13")}</Text>
      {i18n.t("help.scr_1_5_14")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_15")}</Text>
      {i18n.t("help.scr_1_5_16")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_17")}</Text>
      {i18n.t("help.scr_1_5_18")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_19")}</Text>
      {i18n.t("help.scr_1_5_20")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_1_5_21")} </Text>
      {i18n.t("help.scr_1_5_22")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_1_6")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_1_6_1")}
      {"\n\n"}
      <Text style={{ fontWeight: "bold" }}> {i18n.t("help.scr_1_6_2")}</Text>
      {"\n\n"}
      {i18n.t("help.scr_1_6_3")}
      {"\n\n"}
      <Text style={{ fontWeight: "bold" }}> {i18n.t("help.scr_1_6_4")}</Text>
      {"\n\n"}
      {i18n.t("help.scr_1_6_5")}
      {"\n"}
    </Text>
    <TouchableNativeFeedback
      onPress={() =>
        browser(
          "https://knowledge.statpearls.com/chapter/0/19682?utm_source=pubmed"
        )
      }
    >
      <Text style={{ color: link, fontStyle: "italic" }}>
        {i18n.t("help.source")}
        https://knowledge.statpearls.com/chapter/0/19682?utm_source=pubmed/)
        {"\n\n"}
      </Text>
    </TouchableNativeFeedback>
  </View>
);

const SCREEN_2 = (color, link) => (
  <View>
    <Text style={{ color, fontSize: wp(5), fontWeight: "bold" }}>
      {i18n.t("help.scr_2_0")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_2_1")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_2_2")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_2_3")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_1")}</Text>
      {i18n.t("help.scr_2_3_2")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_3")}</Text>
      {i18n.t("help.scr_2_3_4")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_5")}</Text>
      {i18n.t("help.scr_2_3_6")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_7")}</Text>
      {i18n.t("help.scr_2_3_8")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_9")}</Text>
      {i18n.t("help.scr_2_3_10")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_11")}</Text>
      {i18n.t("help.scr_2_3_12")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_13")}</Text>
      {i18n.t("help.scr_2_3_14")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_15")}</Text>
      {i18n.t("help.scr_2_3_16")}
      {"\n\n"}
      <Text style={{ fontStyle: "italic" }}>{i18n.t("help.scr_2_3_17")}</Text>
      {i18n.t("help.scr_2_3_18")}
      <Text style={{ fontStyle: "italic" }}>{i18n.t("help.scr_2_3_19")}</Text>
      {i18n.t("help.scr_2_3_20")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_21")}</Text>
      {i18n.t("help.scr_2_3_22")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_23")}</Text>
      {i18n.t("help.scr_2_3_24")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_25")}</Text>
      {i18n.t("help.scr_2_3_26")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_27")}</Text>
      {i18n.t("help.scr_2_3_28")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_29")}</Text>
      {i18n.t("help.scr_2_3_30")}
      {"\n\n"}•{" "}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_31")}</Text>
      {i18n.t("help.scr_2_3_32")}
      {"\n\n"}
      <Text style={{ fontWeight: "bold" }}>{i18n.t("help.scr_2_3_33")}</Text>
      {i18n.t("help.scr_2_3_34")}
      {"\n\n"}
    </Text>

    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_2_4")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_2_5")}
      {"\n\n"}
    </Text>
    <Text style={{ color, fontSize: wp(4.4), fontWeight: "bold" }}>
      {i18n.t("help.scr_2_6")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_2_7")}
      {"\n"}
    </Text>
    <TouchableNativeFeedback
      onPress={() =>
        browser("https://en.wikipedia.org/wiki/Cognitive_distortion")
      }
    >
      <Text style={{ color: link, fontStyle: "italic" }}>
        {i18n.t("help.source")}{" "}
        https://en.wikipedia.org/wiki/Cognitive_distortion)
        {"\n\n"}
      </Text>
    </TouchableNativeFeedback>
  </View>
);

const SCREEN_3 = (color, link) => (
  <View>
    <Text style={{ color, fontSize: wp(5), fontWeight: "bold" }}>
      {i18n.t("help.scr_3_0")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_3_1")}
      {"\n\n"}
    </Text>
  </View>
);

const SCREEN_4 = (color, link) => (
  <View>
    <Text style={{ color, fontSize: wp(5), fontWeight: "bold" }}>
      {i18n.t("help.scr_4_0")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_4_1")}
      {"\n\n"}
    </Text>
  </View>
);

const SCREEN_5 = (color, link) => (
  <View>
    <Text style={{ color, fontSize: wp(5), fontWeight: "bold" }}>
      {i18n.t("help.scr_5_0")}
      {"\n"}
    </Text>
    <Text style={{ color }}>
      {i18n.t("help.scr_5_1")}
      {"\n\n"}
    </Text>
    <TouchableNativeFeedback
      onPress={() => browser("https://en.wikipedia.org/wiki/SQLite")}
    >
      <Text style={{ color: link, fontStyle: "italic" }}>
        {i18n.t("help.source")} https://en.wikipedia.org/wiki/SQLite)
        {"\n\n"}
      </Text>
    </TouchableNativeFeedback>
    <TouchableNativeFeedback
      onPress={() => browser("https://sqlitebrowser.org")}
    >
      <Text style={{ color: link, fontStyle: "italic" }}>
        {i18n.t("help.source")} https://sqlitebrowser.org)
        {"\n\n"}
      </Text>
    </TouchableNativeFeedback>
    <TouchableNativeFeedback
      onPress={() => browser("https://inloop.github.io/sqlite-viewer/")}
    >
      <Text style={{ color: link, fontStyle: "italic" }}>
        {i18n.t("help.source")} https://inloop.github.io/sqlite-viewer/)
        {"\n\n"}
      </Text>
    </TouchableNativeFeedback>
    <TouchableNativeFeedback
      onPress={() => browser("https://www.winzip.com/win/en/prod_down.html")}
    >
      <Text style={{ color: link, fontStyle: "italic" }}>
        {i18n.t("help.source")} https://www.winzip.com/win/en/prod_down.html)
        {"\n\n"}
      </Text>
    </TouchableNativeFeedback>
  </View>
);

Help.contextType = ThemeContext;

export default Help;
