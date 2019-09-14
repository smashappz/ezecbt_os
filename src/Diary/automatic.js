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

class Automatic extends Component {
  constructor(props) {
    super(props);
    const { post } = props;

    this.state = {
      automatic: post ? post.automatic : "",
      info: false
    };
  }

  info = () => {
    this.setState(state => ({
      info: !state.info
    }));
  };

  update = automatic => {
    const { updateThoughts } = this.props;

    this.setState({
      automatic
    });

    updateThoughts(automatic);
  };

  render() {
    const { mic, toggleMic } = this.props;
    const { automatic, info } = this.state;
    const { theme } = this.context;
    const { color, link } = theme;

    return (
      <View style={styles.slide}>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Text style={[{ color }, styles.header]}>
            {i18n.t("diary.auto_title")}
          </Text>
          <TouchableNativeFeedback onPress={this.info}>
            <Icon
              name="md-information-circle-outline"
              size={wp(6.7)}
              color={color}
              style={{ padding: 8, paddingLeft: 0 }}
            />
          </TouchableNativeFeedback>
        </View>
        {info && (
          <View style={{ paddingHorizontal: wp(5), paddingVertical: 0 }}>
            <Text
              style={{
                color
              }}
            >
              {i18n.t("diary.auto_help")}
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
        )}
        {!info && (
          <View style={{ alignItems: "center", paddingHorizontal: wp(5) }}>
            <AutoGrowingTextInput
              autoFocus={true}
              defaultValue={automatic}
              onChangeText={thoughts => this.update(thoughts)}
              ref={component => (thoughtsAutoInput = component)}
              style={[{ color: "black" }, styles.textInput]}
              placeholder={i18n.t("diary.auto_input")}
            />
            <View
              style={{
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableNativeFeedback
                onPress={() => toggleMic("mic", "automatic")}
              >
                <Icon
                  name="md-microphone"
                  size={wp(6.7)}
                  color={mic ? "green" : "red"}
                  style={{ padding: 12 }}
                />
              </TouchableNativeFeedback>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export let thoughtsAutoInput;

Automatic.contextType = ThemeContext;

export default Automatic;
