// @flow
import React from "react";
import {
  Alert,
  Animated,
  AppState,
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PushNotificationIOS,
  LayoutAnimation
} from "react-native";
import { WebView } from "react-native-webview";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import RNFetchBlob from "rn-fetch-blob";
import Sound from "react-native-sound";
import { logger } from "react-native-logger";

import { colors, ColorProgress, images, ImageButton } from "../../common/ui";
import { saveHelper } from "../../common/utils";
import { getHtml } from "./html";
import { SettingsActions } from "../../actions";

Sound.setCategory("Playback", true);
Sound.setMode("MoviePlayback");

const meditationSound = new Sound("sound.mp3", Sound.MAIN_BUNDLE);

const webViewWidth = Dimensions.get("window").width;
const MIN_VISIBLE_W = 40;
const MIN_BORDER_W = 12;
const BREAK_PERIOD = 10;

const LOCK_TIME_THRESHOLD = 300;
const NOTIF_DELAY = 100;
const FINAL_PUSH_T_ADJUST = 2;
const SOUND_DUR_CORRECTION = new Map([
  [10, 11],
  [15, 11],
  [20, 11],
  [25, 14],
  [30, 14],
  [35, 16],
  [40, 16],
  [45, 18],
  [50, 20],
  [55, 22],
  [60, 25]
]);

function scheduleFinalNotification(fireTime: number) {
  const fireDate = Date.now() + (fireTime + FINAL_PUSH_T_ADJUST) * 1000;

  PushNotificationIOS.checkPermissions(permissions => {
    if (permissions.alert === 1) {
      PushNotificationIOS.scheduleLocalNotification({
        fireDate,
        alertTitle: "Time is up.",
        alertBody: "The artwork is now fully evolved!"
      });
    }
  });
}

type Props = {
  duration: number,
  soundOn: boolean,
  navigation: NavigationScreenProp<*>,
  setSoundStatePref: (soundState: boolean) => void
};

type State = {
  animValue: Animated.Value,
  progressTime: number,
  isComplete: boolean,
  backStartTime: number,
  showBigCover: boolean,
  isBackNotLocked: boolean,
  cancelTime: number,
  progressLeft: number,
  html: string
};

const mapStateToProps = ({ duration, settings }) => ({
  duration: duration.duration,
  soundOn: settings.soundOn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(SettingsActions, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class MeditationScreen extends React.Component<Props, State> {
  progressTimerId: IntervalID;
  $webView: WebView;
  inactiveTime: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      progressTime: props.duration,
      isComplete: false,
      backStartTime: Date.now(),
      showBigCover: true,
      isBackNotLocked: false,
      animValue: new Animated.Value(props.duration),
      cancelTime: 8,
      progressLeft: 0,
      html: getHtml(webViewWidth, webViewWidth, props.duration)
    };
  }

  componentDidMount() {
    this.startSound();
    AppState.addEventListener("change", this.onAppStateChange);
  }

  componentWillUnmount() {
    this.onBreakProcess();
  }

  startSound() {
    const soundDuration = meditationSound.getDuration();
    const fullDuration =
      this.props.duration + SOUND_DUR_CORRECTION.get(this.props.duration / 60);
    const numberOfLoops = Math.floor(fullDuration / soundDuration);
    const startPosition = soundDuration - (fullDuration % soundDuration);

    meditationSound
      .setCurrentTime(Math.max(startPosition, 0))
      .setNumberOfLoops(numberOfLoops)
      .setVolume(this.props.soundOn ? 0.5 : 0)
      .play(success => {
        // TODO: just not forget to add it in android
        // TODO: component remove it in iOS component
        if (!success && Platform.OS === "android") {
          meditationSound.reset();
        }
      });
  }

  setupProgressTime() {
    this.progressTimerId = setInterval(() => {
      const { progressTime, cancelTime } = this.state;
      const nextProgressTime = progressTime - 1;
      const isComplete = nextProgressTime <= 0;

      this.setState(
        {
          isComplete,
          progressTime: nextProgressTime,
          cancelTime: cancelTime >= 0 ? cancelTime - 1 : -1,
          showBigCover: cancelTime >= 7
        },
        () => {
          if (isComplete) {
            sendMessageToWebView(this.$webView, { type: "save" });
            this.onBreakProcess();
          }
        }
      );
    }, 1000);
  }

  handleActiveState() {
    const {
      backStartTime,
      isBackNotLocked,
      progressTime,
      progressLeft
    } = this.state;
    const timePass = Math.floor((Date.now() - backStartTime) / 1000);

    if (isBackNotLocked) {
      // Test if app was above 10 sec in backgroundColor
      if (timePass >= BREAK_PERIOD) {
        sendMessageToWebView(this.$webView, { type: "clear" });
        this.props.navigation.navigate("FailScreen", {
          maxDuration: this.props.duration,
          currDuration: progressTime
        });
        this.onBreakProcess();
        return;
      }

      // reschedule final notification
      scheduleFinalNotification(progressLeft - timePass);
    }

    const newProgressTime = Math.max(progressLeft - timePass, 0);
    LayoutAnimation.linear();
    this.setState({
      progressTime: newProgressTime,
      isBackNotLocked: false
    });
  }

  onNotLockedBackground = () => {
    if (this.state.isComplete) return;

    this.setState({
      backStartTime: Date.now(),
      isBackNotLocked: true
    });

    PushNotificationIOS.cancelAllLocalNotifications();
    PushNotificationIOS.checkPermissions(permissions => {
      if (permissions.alert === 1) {
        PushNotificationIOS.scheduleLocalNotification({
          fireDate: Date.now() + NOTIF_DELAY,
          alertTitle: "Attention!",
          alertBody:
            "The artwork will be destroyed If you " +
            "do not return to the Introvert app."
        });
      }
    });
  };

  onAppStateChange = (state: AppStateType) => {
    const { isComplete, progressTime } = this.state;

    if (isComplete) return;

    switch (state) {
      case "active":
        this.handleActiveState();
        break;

      case "inactive":
        this.inactiveTime = Date.now();
        break;

      case "background":
        this.setState({
          cancelTime: -1,
          backStartTime: Date.now(),
          progressLeft: progressTime
        });
        if (Date.now() - this.inactiveTime > LOCK_TIME_THRESHOLD) {
          this.onNotLockedBackground();
        }

        break;

      default:
        break;
    }
  };

  onLoadEnd = () => {
    this.setupProgressTime();

    Animated.timing(this.state.animValue, {
      toValue: 0,
      duration: (this.props.duration + this.props.duration / 10) * 1000
    }).start();

    scheduleFinalNotification(this.props.duration);
  };

  onTouchScreen = () => {
    if (this.state.isComplete) {
      this.props.navigation.goBack();
    }
  };

  onCloseScreenPress = () => {
    const { isComplete, cancelTime, progressTime } = this.state;
    const { navigation } = this.props;

    if (cancelTime >= 0) {
      this.onBreakProcess();
      navigation.goBack();
      return;
    } else if (isComplete) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      "Are you sure?",
      "The artwork will be destroyed.",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "OK",
          onPress: () => {
            this.onBreakProcess();
            sendMessageToWebView(this.$webView, { type: "clear" });
            this.props.navigation.navigate("FailScreen", {
              maxDuration: this.props.duration,
              currDuration: progressTime
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  onEarlyCancelPress = () => {
    const { navigation } = this.props;
    this.onBreakProcess();
    navigation.goBack();
  };

  onBreakProcess = () => {
    clearInterval(this.progressTimerId);
    meditationSound.stop();
    PushNotificationIOS.cancelAllLocalNotifications();
    AppState.removeEventListener("change", this.onAppStateChange);
    sendMessageToWebView(this.$webView, { type: "stop" });

    this.setState({ isComplete: true });
  };

  onMessage = async ({ nativeEvent }: Object) => {
    const imageData = JSON.parse(nativeEvent.data);
    let message = {};
    message = JSON.parse(nativeEvent.data);
    const fileName = `${moment().format("YYYYMMDD-HHmmssSSS")}.jpeg`;
    const filePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${fileName}`;

    RNFetchBlob.fs.createFile(filePath, imageData.data.substr(23), "base64");

    const imageFileInfo = {
      name: filePath,
      size: imageData.size,
      canvasSize: imageData.canvasSize,
      location: "Stockholm",
      date: new Date()
    };
    await saveHelper.saveImageInfo(imageFileInfo);
  };

  onSwitchSound = () => {
    const { soundOn } = this.props;

    this.props.setSoundStatePref(!soundOn);

    if (soundOn) {
      meditationSound.setVolume(0);
    } else {
      meditationSound.setVolume(0.5);
    }
  };

  renderWebView() {
    const { duration } = this.props;
    const { animValue, html } = this.state;

    const borderWidth = animValue.interpolate({
      inputRange: [0, duration],
      outputRange: [MIN_BORDER_W, webViewWidth / 2 - MIN_VISIBLE_W],
      extrapolate: "clamp"
    });

    return (
      <View style={styles.webViewWrapper}>
        <WebView
          // eslint-disable-next-line no-return-assign
          style={{ marginTop: -8 }}
          ref={r => (this.$webView = r)}
          startInLoadingState
          mediaPlaybackRequiresUserAction={false}
          onLoadEnd={this.onLoadEnd}
          renderLoading={() => <View style={styles.loadingView} />}
          originWhitelist={["*"]}
          source={{ html, baseUrl: "/" }}
          scrollEnabled={false}
          onMessage={this.onMessage}
          // contentInset={{ top: -8 }}
          allowsInlineMediaPlayback
        />

        <Animated.View
          style={[
            styles.webViewCover,
            StyleSheet.absoluteFillObject,
            { borderWidth }
          ]}
        />
      </View>
    );
  }

  renderNavBar() {
    const { soundOn } = this.props;
    const { cancelTime, isComplete, progressTime } = this.state;
    const isSuccess = progressTime <= 0;

    return (
      <View style={styles.navBar}>
        <ImageButton
          onPress={this.onCloseScreenPress}
          source={isComplete && isSuccess ? images.doneIcon : images.closeIcon}
        />

        {cancelTime >= 0 && (
          <TouchableOpacity onPress={this.onEarlyCancelPress}>
            <Text style={styles.cancelBtnText}>CANCEL {cancelTime}</Text>
          </TouchableOpacity>
        )}

        {!isComplete && (
          <ImageButton
            onPress={this.onSwitchSound}
            source={soundOn ? images.soundOnIcon : images.soundMuteIcon}
          />
        )}
      </View>
    );
  }

  render() {
    const { progressTime, isComplete, showBigCover } = this.state;

    const timeText = moment
      .duration(progressTime, "second")
      // $FlowFixMe
      .format("mm:ss", { trim: false });
    const opacity = !isComplete ? 1 : 0;

    return (
      <TouchableWithoutFeedback onPress={this.onTouchScreen}>
        <View style={styles.container}>
          {this.renderNavBar()}

          <View style={styles.content}>
            <View style={styles.webViewCont}>{this.renderWebView()}</View>

            <Text
              style={[
                styles.timeText,
                { color: isComplete ? colors.subText : colors.white }
              ]}
            >
              {isComplete ? "COMPLETE" : timeText}
            </Text>

            {showBigCover && <View style={styles.bigCover} />}
          </View>

          <ColorProgress
            style={{ opacity }}
            maxValue={this.props.duration}
            value={progressTime}
            backgroundColor={colors.timeLineBackground}
            fillColor={colors.timeLineFront}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function sendMessageToWebView(webView, messageData) {
  try {
    if (webView) {
      const clientResponseCode = `
        window.postMessage(${JSON.stringify(messageData)}, "*");
        true;
      `;
      webView.injectJavaScript(clientResponseCode);
    }
  } catch (err) {
    logger.log("Some parsing error", err);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32
  },

  navBar: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8
  },

  cancelBtnText: {
    fontSize: 17,
    fontFamily: "IBMPlexMono",
    color: colors.white
  },

  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: colors.black
  },

  webViewCont: {
    width: webViewWidth,
    height: webViewWidth,
    borderRadius: webViewWidth / 2,
    backgroundColor: colors.black,
    overflow: "hidden"
  },

  webViewWrapper: {
    flex: 1
  },

  webViewCover: {
    top: -webViewWidth / 2,
    bottom: -webViewWidth / 2,
    right: -webViewWidth / 2,
    left: -webViewWidth / 2,
    borderRadius: webViewWidth,
    borderColor: colors.black
  },

  bigCover: {
    position: "absolute",
    top: webViewWidth - 75,
    backgroundColor: colors.black,
    width: webViewWidth,
    height: 110
  },

  loadingView: {
    width: webViewWidth,
    height: webViewWidth,
    backgroundColor: colors.black
  },

  timeText: {
    fontSize: 19,
    fontFamily: "IBMPlexMono-Medium",
    color: colors.white,
    marginTop: 35
  }
});
