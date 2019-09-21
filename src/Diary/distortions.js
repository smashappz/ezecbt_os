import React, { Component } from "react";
import { Switch, Text, TouchableNativeFeedback, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import i18n from "../i18n";
import {
  styles,
  SwitchLeft,
  SwitchRight,
  SwitchText,
  SwitchView
} from "./styles";
import { browser, ThemeContext } from "../utils";

class Distortions extends Component {
  state = {
    info: false
  };

  info = () => {
    this.setState(state => ({
      info: !state.info
    }));
  };

  render() {
    const { distortions, updateDistortion } = this.props;
    const { info } = this.state;
    const { theme } = this.context;
    const { color, link } = theme;

    return (
      <View style={styles.slide}>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Text style={[{ color }, styles.header]}>
            {i18n.t("diary.dist_title")}
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
            <Text style={{ color }}>
              {i18n.t("diary.dist_intro")}
              {"\n\n"}•{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_all")}:{" "}
              </Text>
              {i18n.t("diary.dist_all2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_all3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_right")}:{" "}
              </Text>
              {i18n.t("diary.dist_right2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_right3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_cat")}:{" "}
              </Text>
              {i18n.t("diary.dist_cat2")}
              {"\n\n"}{" "}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_cat3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_disq")}:{" "}
              </Text>
              {i18n.t("diary.dist_disq2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_disq3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_emo")}:{" "}
              </Text>
              {i18n.t("diary.dist_emo2")}
              {"\n\n"}{" "}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_emo3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_change")}:{" "}
              </Text>
              {i18n.t("diary.dist_change2")}
              {"\n\n"}{" "}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_change3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_fair")}:{" "}
              </Text>
              {i18n.t("diary.dist_fair2")}
              {"\n\n"}{" "}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_fair3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_fortune")}:{" "}
              </Text>
              {i18n.t("diary.dist_fortune2")}
              {"\n\n"}{" "}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_fortune3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_label")}:{" "}
              </Text>
              {i18n.t("diary.dist_label2")}
              {"\n\n"}{" "}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_label3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_mind")}:{" "}
              </Text>
              {i18n.t("diary.dist_mind2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_mind3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_min")}:{" "}
              </Text>
              {i18n.t("diary.dist_min2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_min3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_over")}:{" "}
              </Text>
              {i18n.t("diary.dist_over2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_over3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_person")}:{" "}
              </Text>
              {i18n.t("diary.dist_person2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_person3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_sel")}:{" "}
              </Text>
              {i18n.t("diary.dist_sel2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_sel3")}
                {"\n\n"}
              </Text>
              •{" "}
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("diary.dist_should")}:{" "}
              </Text>
              {i18n.t("diary.dist_should2")}
              {"\n\n"}
              <Text
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontWeight: "bold"
                }}
              >
                {i18n.t("diary.dist_should3")}
                {"\n"}
              </Text>
            </Text>
            <TouchableNativeFeedback
              onPress={() =>
                browser(
                  "https://knowledge.statpearls.com/chapter/0/19682?utm_source=pubmed"
                )
              }
            >
              <Text style={{ color: link, fontStyle: "italic" }}>
                {i18n.t("help.adapted")}
                https://knowledge.statpearls.com/chapter/0/19682?utm_source=pubmed/)
                {"\n"}
              </Text>
            </TouchableNativeFeedback>
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
          </View>
        )}
        {!info && (
          <View style={{ alignItems: "center", width: "60%" }}>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.allOrNothing}>
                  {i18n.t("diary.dist_all")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("allOrNothing", value);
                  }}
                  value={distortions.allOrNothing}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.alwaysRight}>
                  {i18n.t("diary.dist_right")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("alwaysRight", value);
                  }}
                  value={distortions.alwaysRight}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.catastrophizing}>
                  {i18n.t("diary.dist_cat")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("catastrophizing", value);
                  }}
                  value={distortions.catastrophizing}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.disqualifying}>
                  {i18n.t("diary.dist_disq")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("disqualifying", value);
                  }}
                  value={distortions.disqualifying}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.emotional}>
                  {i18n.t("diary.dist_emo")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("emotional", value);
                  }}
                  value={distortions.emotional}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.change}>
                  {i18n.t("diary.dist_change")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("change", value);
                  }}
                  value={distortions.change}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.fairness}>
                  {i18n.t("diary.dist_fair")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("fairness", value);
                  }}
                  value={distortions.fairness}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.fortune}>
                  {i18n.t("diary.dist_fortune")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("fortune", value);
                  }}
                  value={distortions.fortune}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.labeling}>
                  {i18n.t("diary.dist_label")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("labeling", value);
                  }}
                  value={distortions.labeling}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.mindReading}>
                  {i18n.t("diary.dist_mind")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("mindReading", value);
                  }}
                  value={distortions.mindReading}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.minimization}>
                  {i18n.t("diary.dist_min")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("minimization", value);
                  }}
                  value={distortions.minimization}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText
                  theme={theme}
                  value={distortions.overgeneralization}
                >
                  {i18n.t("diary.dist_over")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("overgeneralization", value);
                  }}
                  value={distortions.overgeneralization}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.personalization}>
                  {i18n.t("diary.dist_person")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("personalization", value);
                  }}
                  value={distortions.personalization}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.selective}>
                  {i18n.t("diary.dist_sel")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("selective", value);
                  }}
                  value={distortions.selective}
                />
              </SwitchRight>
            </SwitchView>
            <SwitchView>
              <SwitchLeft>
                <SwitchText theme={theme} value={distortions.should}>
                  {i18n.t("diary.dist_should")}
                </SwitchText>
              </SwitchLeft>
              <SwitchRight>
                <Switch
                  onValueChange={value => {
                    updateDistortion("should", value);
                  }}
                  value={distortions.should}
                />
              </SwitchRight>
            </SwitchView>
          </View>
        )}
      </View>
    );
  }
}

Distortions.contextType = ThemeContext;

export default Distortions;
