import React, { Component } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import date from "date-and-time";
import { ContributionGraph, LineChart, PieChart } from "react-native-chart-kit";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import i18n from "../i18n";
import { Q } from "@nozbe/watermelondb";
import { trendsCollection, distortionsCollection } from "../Database/db";
import {
  countElements,
  diaryRef,
  getDistortion,
  getMonth,
  getMonthLast,
  screenWidth,
  Settings,
  ThemeContext,
  themes
} from "../utils";

class Trends extends Component {
  state = {
    heatData: [],
    lineChartData: [],
    lineChartLabels: [],
    loading: true,
    pieData: []
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    this.setState({
      loading: true
    });

    const chart = await trendsCollection
      .query(Q.where("key", "6 MONTHS"))
      .fetch();
    const chartInfo = chart.length > 0 ? chart[0] : null;

    let lineChartData = [0, 0, 0, 0, 0, 0];
    let lineChartLabels = [];

    if (chartInfo) {
      lineChartLabels = JSON.parse(chartInfo.labels);
      const totals = countElements(JSON.parse(chartInfo.data));

      for (const t in totals) {
        lineChartData[lineChartLabels.indexOf(getMonth(Number(t)))] = totals[t];
      }
    }

    const heat = await trendsCollection
      .query(Q.where("key", "3 MONTHS"))
      .fetch();
    const heatInfo = heat.length > 0 ? heat[0] : null;
    let heatData = [];

    if (heatInfo) {
      const values = countElements(JSON.parse(heatInfo.data));

      for (const k in values) {
        heatData.push({
          date: date.format(new Date(Number(k)), "YYYY-MM-DD"),
          count: values[k]
        });
      }
    }

    this.getPieData();

    this.setState({
      heatData,
      lineChartData,
      lineChartLabels,
      loading: false
    });
  }

  async getPieData() {
    this.setState({
      loading: true
    });

    let distortions = await distortionsCollection.query().fetch();

    if (!distortions) {
      this.setState({
        loading: false,
        pieData: []
      });
      return;
    }

    distortions = distortions.filter(d => d.count > 0);
    const l = distortions.length;

    if (l === 0) {
      this.setState({
        loading: false,
        pieData: []
      });
      return;
    }

    if (!Settings.pieChart && l > 5) {
      const count = distortions
        .slice(5)
        .map(d => d.count)
        .reduce((sum, val) => sum + val);

      distortions = distortions.slice(0, 5);

      if (count > 0) {
        distortions.push({ key: "others", count });
      }
    }

    distortions.sort((a, b) => b.count - a.count);

    const pieData = distortions.map((d, index) => {
      let name = getDistortion(d.key);

      if (name.length > 16) {
        name = name.slice(0, 16) + "..";
      }

      return {
        color: pieColors[index],
        legendFontSize: wp(2.8),
        name,
        population: d.count
      };
    });

    this.setState({
      loading: false,
      pieData
    });
  }

  render() {
    const { heatData, lineChartData, lineChartLabels, loading } = this.state;
    const { theme } = this.context;
    const { backgroundColor, borderColor, color } = theme;
    const chartConfig = {
      backgroundColor,
      backgroundGradientFrom: backgroundColor,
      backgroundGradientTo: backgroundColor,
      color: (opacity = 1) =>
        theme === themes.light
          ? `rgba(0, 0, 0, ${opacity})`
          : `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderColor,
        borderRadius: 16
      }
    };

    const lineChartInfo = {
      labels: lineChartLabels,
      datasets: [
        {
          data: lineChartData,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };

    const pieData = this.state.pieData.map(d => ({
      ...d,
      legendFontColor: color
    }));
    let hasData = false;

    try {
      hasData = diaryRef.current.state.posts.length > 0;
    } catch (e) {}

    return (
      <View>
        {!hasData && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: wp(2.2)
            }}
          >
            <Text
              style={{
                color,
                fontSize: wp(4.4),
                fontWeight: "bold"
              }}
            >
              {i18n.t("trends.no_data")}
            </Text>
          </View>
        )}
        {loading && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: wp(2.2)
            }}
          >
            {hasData && (
              <ActivityIndicator color={color} style={{ padding: 4 }} />
            )}
          </View>
        )}
        {pieData.length > 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: wp(2.2)
            }}
          >
            <Text
              style={{
                color,
                fontSize: wp(4.4),
                fontWeight: "bold"
              }}
            >
              {i18n.t("trends.dist_sum")}
            </Text>
            <PieChart
              accessor="population"
              backgroundColor="transparent"
              chartConfig={chartConfig}
              data={pieData}
              height={hp(37.2)}
              style={{ paddingHorizontal: wp(2.2) }}
              width={screenWidth}
            />
          </View>
        )}
        {lineChartLabels.length > 0 && hasData && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: wp(2.2)
            }}
          >
            <Text
              style={{
                color,
                fontSize: wp(4.4),
                fontWeight: "bold"
              }}
            >
              {i18n.t("trends.totals")}
            </Text>
            <LineChart
              bezier
              chartConfig={chartConfig}
              data={lineChartInfo}
              height={hp(37.2)}
              width={screenWidth}
            />
          </View>
        )}
        {heatData.length > 0 && hasData && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: wp(4.4)
            }}
          >
            <Text
              style={{
                color,
                fontSize: wp(4.4),
                fontWeight: "bold"
              }}
            >
              {i18n.t("trends.heatmap")}
            </Text>
            <ContributionGraph
              chartConfig={chartConfig}
              endDate={getMonthLast()}
              height={hp(37.2)}
              numDays={90}
              style={{ paddingHorizontal: wp(2.2) }}
              width={screenWidth}
              values={heatData}
            />
          </View>
        )}
      </View>
    );
  }
}

const pieColors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "cyan",
  "brown",
  "gray",
  "gold",
  "lime",
  "olive",
  "pink",
  "silver",
  "violet"
];

Trends.contextType = ThemeContext;

export default Trends;
