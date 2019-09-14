import React, { Component } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import i18n from "../i18n";
import { styles } from "./styles";
import { browser, ThemeContext } from "../utils";

class Restructure extends Component {
  constructor(props) {
    super(props);
    const { post } = props;

    this.state = {
      alternativeInput: post ? post.alternative : "",
      challenge: post ? post.challenge : "",
      info: false
    };
  }

  info = () => {
    this.setState(state => ({
      info: !state.info
    }));
  };

  updateAlt = alternativeInput => {
    const { updateThoughtsAlt } = this.props;

    this.setState({
      alternativeInput
    });

    updateThoughtsAlt(alternativeInput);
  };

  updateChal = challenge => {
    const { updateThoughtsChal } = this.props;

    this.setState({
      challenge
    });

    updateThoughtsChal(challenge);
  };

  render() {
    const {
      alternative,
      automatic,
      micAlt,
      micChal,
      post,
      save,
      toggleMic
    } = this.props;
    const { alternativeInput, challenge, info } = this.state;
    const { theme } = this.context;
    const { borderColor, color, link } = theme;
    const showSave = (alternative.length >= 8 && automatic.length >= 8) || post;

    return (
      <View style={styles.slide}>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Text style={[{ color }, styles.header]}>
            {i18n.t("diary.rest_cr_title")}
          </Text>
          <TouchableNativeFeedback onPress={this.info}>
            <Icon
              name="md-information-circle-outline"
              size={24}
              color={color}
              style={{ padding: 8, paddingLeft: 0 }}
            />
          </TouchableNativeFeedback>
        </View>
        {info && (
          <View style={{ padding: wp(5), paddingVertical: 0 }}>
            <Text style={{ borderBottomWidth: 1, borderColor, color }}>
              {i18n.t("diary.rest_cr")}
              {"\n\n"}
              <TouchableNativeFeedback
                onPress={() =>
                  browser("https://en.wikipedia.org/wiki/Cognitive_distortion")
                }
              >
                <Text style={{ color: link, fontStyle: "italic" }}>
                  {i18n.t("help.adapted")}
                  https://en.wikipedia.org/wiki/Cognitive_distortion)
                  {"\n\n"}
                </Text>
              </TouchableNativeFeedback>
            </Text>
            <Text style={{ color }}>
              {"\n"}
              {i18n.t("diary.rest_chal_help")}
            </Text>
          </View>
        )}
        {!info && (
          <View style={{ alignItems: "center", paddingHorizontal: wp(5) }}>
            <Text style={[{ color }, styles.header2]}>
              {i18n.t("diary.rest_chal_title")}
            </Text>
            <AutoGrowingTextInput
              autoFocus={true}
              defaultValue={challenge}
              onChangeText={thoughts => this.updateChal(thoughts)}
              ref={component => (thoughtsChalInput = component)}
              style={[{ color: "black" }, styles.textInput]}
              placeholder={i18n.t("diary.rest_chal")}
            />
            <TouchableNativeFeedback
              onPress={() => toggleMic("micChal", "challenge")}
            >
              <Icon
                name="md-microphone"
                size={wp(6.7)}
                color={micChal ? "green" : "red"}
                style={{ padding: 12 }}
              />
            </TouchableNativeFeedback>
            <Text style={[styles.header2, { color, paddingTop: 16 }]}>
              {i18n.t("diary.rest_alt_title")}
            </Text>
            <AutoGrowingTextInput
              defaultValue={alternativeInput}
              onChangeText={thoughts => this.updateAlt(thoughts)}
              ref={component => (thoughtsAltInput = component)}
              style={[{ color: "black" }, styles.textInput]}
              placeholder={i18n.t("diary.rest_alt")}
            />
            <TouchableNativeFeedback
              onPress={() => toggleMic("micAlt", "alternative")}
            >
              <Icon
                name="md-microphone"
                size={wp(6.7)}
                color={micAlt ? "green" : "red"}
                style={{ padding: 12 }}
              />
            </TouchableNativeFeedback>
            {showSave && (
              <View style={{ padding: 24 }}>
                <TouchableNativeFeedback onPress={() => save()}>
                  <Text
                    style={{
                      backgroundColor: "red",
                      borderColor: "red",
                      borderRadius: 8,
                      borderWidth: 1,
                      color: "white",
                      fontWeight: "bold",
                      padding: 8
                    }}
                  >
                    {" "}
                    {i18n.t("diary.rest_save")}{" "}
                  </Text>
                </TouchableNativeFeedback>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

export let thoughtsAltInput;

export let thoughtsChalInput;

Restructure.contextType = ThemeContext;

export default Restructure;
