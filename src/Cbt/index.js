import React, { Fragment, Component } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableNativeFeedback,
  View
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-community/async-storage";
import { Calendar } from "react-native-calendars";
import date from "date-and-time";
import i18n from "../i18n";
import RCModal from "react-native-modal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import ScrollableTabView from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Ionicons";
import Config from "../Config";
import Diary from "../Diary";
import Help from "../Help";
import TabBar from "../TabBar";
import Trends from "../Trends";
import {
  configRef,
  diaryRef,
  setData,
  trendsRef,
  ThemeContext
} from "../utils";
import { styles } from "./styles";

class CBTApp extends Component {
  state = {
    modal3Visible: false,
    search: false,
    showIntro: false,
    timestamp: 0
  };

  calendarItem = (
    <Calendar
      hideExtraDays={true}
      maxDate={date.addDays(new Date(), -1).toString()}
      minDate={"2019-08-01"}
      monthFormat={"MMM yyyy"}
      onDayPress={day => {
        this.setModal3Visible(false);
        this.setState({
          search: false,
          timestamp: day.timestamp
        });
      }}
    />
  );

  async componentDidMount() {
    const intro = await AsyncStorage.getItem("showIntro");

    this.setState({
      showIntro: intro ? intro === "true" : true
    });
  }

  onBannerPress = () => {};

  onSearch = () => {
    this.setState(state => ({
      search: !state.search
    }));
  };

  onSearchCancel = () => {
    this.setState({
      search: false,
      timestamp: 0
    });
  };

  setModal3Visible(visible) {
    this.setState({ modal3Visible: visible });
  }

  render() {
    const { theme } = this.context;
    const { backgroundColor, barStyle, color } = theme;
    const { search, showIntro, timestamp } = this.state;
    const tsString =
      timestamp > 0 ? " " + date.format(new Date(timestamp), "D MMM YYYY") : "";

    return (
      <Fragment>
        <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
        <ScrollableTabView
          style={[styles.container, { backgroundColor }]}
          renderTabBar={() => <TabBar />}
        >
          <View tabLabel="ios-book">
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: wp(6.7),
                paddingTop: wp(2.2)
              }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  flex: 1,
                  paddingLeft: wp(2.2)
                }}
              >
                <TouchableNativeFeedback onPress={this.onSearch}>
                  <Icon name="md-search" size={wp(8.9)} color={color} />
                </TouchableNativeFeedback>
              </View>
              {!search && timestamp === 0 && (
                <View
                  style={{
                    alignItems: "flex-end",
                    flex: 1,
                    paddingRight: wp(2.2)
                  }}
                >
                  <TouchableNativeFeedback
                    onPress={() => {
                      diaryRef.current.newPost();
                    }}
                  >
                    <Icon name="md-add-circle" size={wp(8.9)} color="green" />
                  </TouchableNativeFeedback>
                </View>
              )}
            </View>
            {search && (
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Text style={{ color, paddingRight: wp(3.3) }}>
                  {i18n.t("cbt.find")}
                  {tsString}
                </Text>
                {timestamp === 0 && (
                  <TouchableNativeFeedback
                    onPress={() => this.setModal3Visible(true)}
                  >
                    <Icon
                      name="md-calendar"
                      size={wp(7.8)}
                      color={color}
                      style={{ paddingRight: wp(3.3) }}
                    />
                  </TouchableNativeFeedback>
                )}
                {timestamp > 0 && (
                  <TouchableNativeFeedback onPress={this.onSearchCancel}>
                    <Icon name="md-refresh" size={wp(7.8)} color={color} />
                  </TouchableNativeFeedback>
                )}
              </View>
            )}
            {/* <View style={{ paddingVertical: wp(0.6) }} /> */}
            <ScrollView>
              <Diary ref={diaryRef} timestamp={timestamp} />
            </ScrollView>
          </View>
          <ScrollView tabLabel="md-trending-up">
            <Trends ref={trendsRef} />
          </ScrollView>
          <ScrollView tabLabel="md-settings">
            <Config ref={configRef} />
          </ScrollView>
          <ScrollView tabLabel="md-help">
            <Help />
          </ScrollView>
        </ScrollableTabView>
        {showIntro && (
          <Modal animationType="fade" transparent={false} visible={showIntro}>
            <AppIntroSlider
              doneLabel={i18n.t("intro.done")}
              nextLabel={i18n.t("intro.next")}
              onDone={() => {
                this.setState({ showIntro: false });
                setData("showIntro", "false");
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{}}>
                    <ImageBackground
                      source={item.image}
                      style={styles.introImage}
                    >
                      <Text style={[styles.introTitle, { color: item.color }]}>
                        {item.title}
                      </Text>
                    </ImageBackground>
                  </View>
                );
              }}
              slides={introSlides}
              showSkipButton
              skipLabel={i18n.t("intro.skip")}
            />
          </Modal>
        )}
        <RCModal
          isVisible={this.state.modal3Visible}
          onBackdropPress={() => this.setModal3Visible(false)}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            {this.calendarItem}
          </View>
        </RCModal>
      </Fragment>
    );
  }
}

const introSlides = [
  {
    color: "black",
    image: require("../../assets/diary.jpg"),
    key: "diary",
    title: i18n.t("slides.one_title")
  },
  {
    color: "white",
    image: require("../../assets/trends.jpg"),
    key: "trends",
    title: i18n.t("slides.two_title")
  },
  {
    color: "white",
    image: require("../../assets/mic.jpg"),
    key: "mic",
    title: i18n.t("slides.three_title")
  },
  {
    color: "black",
    image: require("../../assets/speaker.jpg"),
    key: "speaker",
    title: i18n.t("slides.four_title")
  }
];

CBTApp.contextType = ThemeContext;

export default CBTApp;
