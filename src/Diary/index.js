import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View
} from "react-native";
import date from "date-and-time";
import Dialog from "react-native-dialog";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import i18n from "../i18n";
import { Q } from "@nozbe/watermelondb";
import Swiper from "react-native-swiper";
import Voice from "react-native-voice";
import Automatic, { thoughtsAutoInput } from "./automatic";
import Distortions from "./distortions";
import {
  createPost,
  deletePost,
  distortionsCollection,
  lastPostsCollection,
  postsCollection,
  updatePost
} from "../Database/db";
import { PostItem } from "../Database/views";
import Restructure, {
  thoughtsAltInput,
  thoughtsChalInput
} from "./restructure";
import {
  automaticRef,
  getDistortion,
  restructureRef,
  speak,
  startRecognizing,
  stopRecognizing,
  ThemeContext,
  trendsRef
} from "../utils";

class Diary extends Component {
  state = {
    alternative: "",
    audio: false,
    automatic: "",
    challenge: "",
    deleteDialog: false,
    distortions: {},
    last: 0,
    loadMore: true,
    mic: false,
    micAlt: false,
    micChal: false,
    micInput: "",
    modalVisible: false,
    post: null,
    posts: [],
    refresh: true
  };

  constructor(props) {
    super(props);
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  async componentDidMount() {
    this.getPosts();
  }

  componentDidUpdate(props, state) {
    const { timestamp } = this.props;
    const { loadMore } = this.state;

    if (props.timestamp !== timestamp) {
      this.setState({
        loadMore: true,
        refresh: true
      });
    }

    if (state.loadMore !== loadMore && loadMore) {
      this.getPosts();
    }
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  deleteCancel = () => {
    this.setState({
      deleteDialog: false,
      post: null
    });
  };

  deleteOK = () => {
    const { post } = this.state;

    if (post === null) {
      this.deleteCancel();
      return;
    }

    this.setState({
      deleteDialog: false
    });

    const { key } = post;
    const _this_ = this;

    deletePost(post, () => {
      _this_.setState(state => ({
        post: null,
        posts: state.posts.filter(p => p.key !== key)
      }));
      trendsRef.current.getData();
    });
  };

  deletePost(post) {
    this.setState({
      deleteDialog: true,
      post
    });
  }

  editPost = post => {
    const distortions = {
      allOrNothing: false,
      alwaysRight: false,
      catastrophizing: false,
      change: false,
      disqualifying: false,
      emotional: false,
      fairness: false,
      fortune: false,
      labeling: false,
      mindReading: false,
      minimization: false,
      overgeneralization: false,
      personalization: false,
      selective: false,
      should: false
    };

    post.distortions.split("+").map(d => {
      if (d && d.length > 0) {
        distortions[d] = true;
      }
    });

    this.setState({
      alternative: "",
      audio: false,
      challenge: "",
      deleteDialog: false,
      distortions,
      mic: false,
      micInput: "",
      post,
      automatic: ""
    });

    this.setModalVisible(true);
  };

  async getPosts() {
    async function load() {
      let { last } = _this_.state;
      let count = 0;
      let posts = [];

      while (count < BATCH && last >= 0) {
        const newPosts = await postsCollection
          .query(
            Q.where("key", Q.gte(last - BATCH)),
            Q.where("key", Q.lt(last))
          )
          .fetch();

        posts = posts.concat(newPosts.slice().reverse());
        count += posts.length;
        last -= BATCH;
      }

      _this_.setState(state => ({
        loadMore: false,
        last,
        posts: state.posts.concat(posts)
      }));
    }

    const { timestamp } = this.props;
    const { refresh } = this.state;
    const _this_ = this;

    if (refresh) {
      if (timestamp === 0) {
        const lastPosts = await lastPostsCollection.query().fetch();

        this.setState(
          {
            last: lastPosts.length > 0 ? lastPosts[0].last : 0,
            posts: [],
            refresh: false
          },
          load
        );
      } else {
        const posts = await postsCollection
          .query(Q.where("created_at", Q.gte(timestamp)))
          .fetch();

        this.setState(
          {
            last: posts.length > 0 ? posts[0].key : 0,
            posts: [],
            refresh: false
          },
          load
        );
      }
    } else {
      load();
    }
  }

  newPost = () => {
    this.setState({
      alternative: "",
      audio: false,
      challenge: "",
      deleteDialog: false,
      distortions: {
        allOrNothing: false,
        alwaysRight: false,
        catastrophizing: false,
        change: false,
        disqualifying: false,
        emotional: false,
        fairness: false,
        fortune: false,
        labeling: false,
        mindReading: false,
        minimization: false,
        overgeneralization: false,
        personalization: false,
        selective: false,
        should: false
      },
      mic: false,
      micInput: "",
      post: null,
      automatic: ""
    });

    this.setModalVisible(true);
  };

  onSpeechError = e => {
    stopRecognizing();
    startRecognizing();
  };

  onSpeechResults = e => {
    try {
      const results = e.value;

      if (!results || results.length === 0) {
        return;
      }

      let words = results[0].toLowerCase();
      words = words.charAt(0).toUpperCase() + words.slice(1);

      const { alternative, automatic, challenge, micInput } = this.state;
      let thoughts;

      switch (micInput) {
        case "alternative":
          thoughts = alternative;
          break;

        case "automatic":
          thoughts = automatic;
          break;

        case "challenge":
          thoughts = challenge;
          break;

        default:
          return;
      }

      const newThoughts = thoughts + (thoughts ? ". " : "") + words;

      this.setState({
        [micInput]: newThoughts
      });

      switch (micInput) {
        case "alternative":
          thoughtsAltInput.setNativeProps({ text: newThoughts });
          restructureRef.current.state.alternativeInput = newThoughts;
          break;

        case "automatic":
          thoughtsAutoInput.setNativeProps({ text: newThoughts });
          automaticRef.current.state.automatic = newThoughts;
          break;

        case "challenge":
          thoughtsChalInput.setNativeProps({ text: newThoughts });
          restructureRef.current.state.challenge = newThoughts;
          break;

        default:
      }
    } catch (e) {}

    startRecognizing();
  };

  save = async () => {
    this.setModalVisible(false);
    let { alternative, automatic, distortions, challenge, post } = this.state;

    if (post !== null) {
      if (!alternative) {
        alternative = post.alternative;
      }

      if (!automatic) {
        automatic = post.automatic;
      }

      if (!challenge) {
        challenge = post.challenge;
      }
    }

    if (!alternative || alternative.length < 8) {
      return;
    }

    if (!automatic || automatic.length < 8) {
      return;
    }

    let distStr = "";

    for (const prop in distortions) {
      if (distortions[prop]) {
        distStr += prop + "+";
      }
    }

    const distList = await distortionsCollection.query().fetch();

    if (post === null) {
      const lastPosts = await lastPostsCollection.query().fetch();
      createPost(
        alternative,
        automatic,
        challenge,
        distStr,
        distList,
        lastPosts,
        () => {
          this.setState({
            loadMore: true,
            refresh: true
          });
          trendsRef.current.getData();
        }
      );
    } else {
      updatePost(post, alternative, automatic, challenge, distStr, distList);
      this.setState({
        post: null
      });
    }
  };

  setModalVisible(modalVisible) {
    stopRecognizing();

    this.setState({
      mic: false,
      micAlt: false,
      micChal: false,
      micInput: "",
      modalVisible
    });
  }

  speakPost(post) {
    if (!post) {
      return;
    }

    const dateThought = date.format(
      new Date(post.createdAt),
      "ddd, D MMM YYYY  h:mm A"
    );

    try {
      let thoughts = i18n.t("diary.thoughts_intro", {
        date: dateThought,
        automatic: post.automatic
      });
      speak(thoughts);

      if (post.distortions.length > 0) {
        thoughts = i18n.t("diary.thoughts_next");
        const distortions = post.distortions.split("+");
        const l = distortions.length;

        distortions.map((d, i) => {
          if (!d) {
            return;
          }

          if (l > 1 && i === l - 2) {
            thoughts += i18n.t("diary.thoughts_and");
          }

          thoughts += getDistortion(d) + ", ";
        });

        speak(thoughts);
      }

      if (post.challenge.length > 0) {
        thoughts = i18n.t("diary.thoughts_chal", { challenge: post.challenge });
        speak(thoughts);
      }

      thoughts = i18n.t("diary.thoughts_final", {
        alternative: post.alternative
      });
      speak(thoughts);
    } catch (e) {}
  }

  toggleMic = (mic, micInput) => {
    stopRecognizing();

    if (!this.state.mic) {
      startRecognizing();
    }

    let mic2, mic3;

    switch (mic) {
      case "mic":
        mic2 = "micAlt";
        mic3 = "micChal";
        break;
      case "micAlt":
        mic2 = "mic";
        mic3 = "micChal";
        break;
      case "micChal":
        mic3 = "mic";
        mic2 = "micAlt";
        break;
      default:
        return;
    }

    this.setState(state => ({
      [mic2]: false,
      [mic3]: false,
      [mic]: !state[mic],
      micInput
    }));
  };

  updateDistortion = (distortion, value) => {
    const { distortions } = this.state;
    distortions[distortion] = value;
    this.setState({ distortions: Object.assign({}, distortions) });
  };

  updateThoughtsAuto = automatic => {
    this.setState({ automatic });
  };

  updateThoughtsAlt = alternative => {
    this.setState({ alternative });
  };

  updateThoughtsChal = challenge => {
    this.setState({ challenge });
  };

  render() {
    const {
      alternative,
      automatic,
      challenge,
      deleteDialog,
      distortions,
      mic,
      micAlt,
      micChal,
      post,
      posts,
      loadMore
    } = this.state;
    const { timestamp } = this.props;
    const { theme } = this.context;
    const { backgroundColor, color } = theme;

    return (
      <View
        style={{
          backgroundColor,
          flex: 1,
          paddingBottom: 16,
          paddingHorizontal: wp(6.7)
        }}
      >
        {posts.length === 0 && loadMore && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 4
            }}
          >
            <ActivityIndicator color={color} />
          </View>
        )}
        <FlatList
          data={posts}
          extraData={this.context}
          initialNumToRender={4}
          keyExtractor={(item, index) => item.id}
          ListEmptyComponent={
            timestamp === 0 ? (
              <Text style={{ color, textAlign: "center" }}>
                {i18n.t("diary.add")}
              </Text>
            ) : null
          }
          onEndReached={() => {
            this.setState({
              loadMore: true
            });
          }}
          onEndReachedThreshold={0.2}
          renderItem={({ item: post }) => {
            return (
              <PostItem
                color={color}
                post={post}
                deletePost={() => this.deletePost(post)}
                editPost={() => this.editPost(post)}
                speakPost={() => this.speakPost(post)}
              />
            );
          }}
        />
        <Dialog.Container visible={deleteDialog}>
          <Dialog.Title>{i18n.t("dialog.titlePost")}</Dialog.Title>
          <Dialog.Description>{i18n.t("dialog.descPost")}</Dialog.Description>
          <Dialog.Button
            label={i18n.t("dialog.btnCancel")}
            onPress={this.deleteCancel}
          />
          <Dialog.Button
            label={i18n.t("dialog.btnDelete")}
            onPress={this.deleteOK}
          />
        </Dialog.Container>
        <Modal
          animationType="fade"
          onRequestClose={() => this.setModalVisible(false)}
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={{ backgroundColor }}>
            <TouchableNativeFeedback
              onPress={() => this.setModalVisible(false)}
            >
              <Icon
                name="md-close"
                size={wp(6.7)}
                color={color}
                style={{ paddingLeft: 8 }}
              />
            </TouchableNativeFeedback>
          </View>
          <Swiper style={{ backgroundColor }} loop={false} showsButtons={false}>
            <ScrollView>
              <Automatic
                automatic={automatic}
                mic={mic}
                post={post}
                ref={automaticRef}
                toggleMic={this.toggleMic}
                updateThoughts={this.updateThoughtsAuto}
              />
            </ScrollView>
            <ScrollView>
              <Distortions
                distortions={distortions}
                post={post}
                updateDistortion={this.updateDistortion}
              />
            </ScrollView>
            <ScrollView>
              <Restructure
                alternative={alternative}
                automatic={automatic}
                challenge={challenge}
                micAlt={micAlt}
                micChal={micChal}
                post={post}
                ref={restructureRef}
                save={this.save}
                toggleMic={this.toggleMic}
                updateThoughtsAlt={this.updateThoughtsAlt}
                updateThoughtsChal={this.updateThoughtsChal}
              />
            </ScrollView>
          </Swiper>
        </Modal>
      </View>
    );
  }
}

const BATCH = 9;

Diary.contextType = ThemeContext;

export default Diary;
