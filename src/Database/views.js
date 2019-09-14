import React from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import date from "date-and-time";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import withObservables from "@nozbe/with-observables";

const rawDistortion = ({ distortion }) => (
  <View>
    <Text>
      {distortion.name}
      {"  "}
      {distortion.description}
    </Text>
  </View>
);

export const DistortionItem = withObservables(
  ["distortion"],
  ({ distortion }) => ({
    distortion
  })
)(rawDistortion);

const rawPost = ({ post, color, deletePost, editPost, speakPost }) => {
  const automatic = post.automatic;
  const title =
    automatic.length > 80 ? automatic.slice(0, 80) + "..." : automatic;

  return (
    <View style={{ paddingHorizontal: wp(4.4), paddingVertical: wp(2.2) }}>
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <View style={{ alignItems: "flex-start", flex: 1 }}>
          <TouchableNativeFeedback onPress={() => speakPost(post)}>
            <Icon name="md-megaphone" size={28} color={color} />
          </TouchableNativeFeedback>
        </View>
        <View style={{ alignItems: "flex-end", flex: 1 }}>
          <TouchableNativeFeedback onPress={() => deletePost(post)}>
            <Icon name="md-trash" size={24} color="red" />
          </TouchableNativeFeedback>
        </View>
      </View>
      <TouchableNativeFeedback onPress={() => editPost(post)}>
        <View>
          <Text style={{ color, fontSize: 18, fontWeight: "bold" }}>
            {title}
          </Text>
          <Text style={{ color: "#808080" }}>
            {date.format(new Date(post.createdAt), "ddd, D MMM YYYY  h:mm A")}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export const PostItem = withObservables(["post"], ({ post }) => ({
  post
}))(rawPost);
