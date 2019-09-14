import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../utils";

class TabBar extends Component {
  icons = [];

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(
      this.setAnimationValue.bind(this)
    );
  }

  setAnimationValue({ value }) {
    this.icons.forEach((icon, i) => {
      const progress = value - i >= 0 && value - i <= 1 ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress)
        }
      });
    });
  }

  iconColor(progress) {
    const red = ACTIVE[0] + (INACTIVE[0] - ACTIVE[0]) * progress;
    const green = ACTIVE[1] + (INACTIVE[1] - ACTIVE[1]) * progress;
    const blue = ACTIVE[2] + (INACTIVE[2] - ACTIVE[2]) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    const { theme } = this.context;

    const styles = StyleSheet.create({
      tab: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
      },
      tabs: {
        backgroundColor: theme.tabBarBgColor,
        flexDirection: "row",
        paddingBottom: 4,
        paddingTop: 4
      }
    });

    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => {
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => this.props.goToPage(i)}
              style={styles.tab}
            >
              <Icon
                name={tab}
                size={32}
                color={
                  this.props.activeTab === i
                    ? "rgb(" +
                      ACTIVE[0] +
                      "," +
                      ACTIVE[1] +
                      "," +
                      ACTIVE[2] +
                      ")"
                    : "rgb(" +
                      INACTIVE[0] +
                      "," +
                      INACTIVE[1] +
                      "," +
                      INACTIVE[2] +
                      ")"
                }
                ref={icon => {
                  this.icons[i] = icon;
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const ACTIVE = [0, 160, 0];
const INACTIVE = [192, 192, 192];

TabBar.contextType = ThemeContext;

export default TabBar;
