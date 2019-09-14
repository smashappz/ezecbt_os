import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import styled from "styled-components/native";

export const ModalAdPro = styled.Text`
  color: blue;
  padding: ${wp(0.6)}px;
  padding-left: ${wp(4.4)}px;
`;

export const ModalButton = styled.Text`
  border-width: 1;
  color: white;
  font-size: ${16};
  font-weight: bold;
  padding: ${wp(2.2)}px;
`;

export const ModalClose = styled(ModalButton)`
  background-color: blue;
  border-color: blue;
  border-radius: 16px;
`;

export const ModalNo = styled(ModalButton)`
  background-color: red;
  border-color: red;
  border-radius: 8px;
`;

export const ModalYes = styled(ModalButton)`
  background-color: green;
  border-color: green;
  border-radius: 8px;
`;

export const ModalHeader = styled.View`
  align-items: center;
  background-color: #e7e8ff;
  border-bottom-width: 1;
  border-color: lightgray;
  flex: 1;
  padding: ${wp(6.7)}px;
  padding-bottom: ${wp(8.9)}px;
`;

export const ModalHeader2 = styled(ModalHeader)`
  padding-bottom: ${wp(2.2)}px;
`;

export const ModalHeader3 = styled(ModalHeader)`
  background-color: white;
  padding-bottom: ${wp(2.2)}px;
`;

export const ModalHdrImage = styled.Image`
  height: ${hp(8.4)}px;
  width: ${wp(20.8)}px;
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  introImage: {
    height: "100%",
    width: "100%"
  },
  introTitle: {
    backgroundColor: "transparent",
    fontWeight: "bold",
    fontSize: wp(6.7),
    textAlign: "center"
  }
});
