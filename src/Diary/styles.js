import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import styled from "styled-components/native";

export const SwitchLeft = styled.View`
  align-items: flex-start;
  flex: 1;
`;

export const SwitchRight = styled.View`
  align-items: flex-end;
  flex: 1;
`;

export const SwitchText = styled.Text`
  color: ${props => (props.value ? "red" : props.theme.color)};
  font-weight: bold;
  padding-left: ${wp(2.2)}px;
`;

export const SwitchView = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: ${wp(2.2)}px;
`;

export const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start"
  },
  header: {
    fontSize: wp(5.6),
    fontWeight: "bold",
    padding: 16
  },
  header2: {
    fontSize: wp(4.4),
    fontWeight: "bold",
    padding: 16,
    paddingTop: 4
  },
  textInput: {
    backgroundColor: "#f4f4f4",
    borderColor: "#f4f4f4",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  }
});
