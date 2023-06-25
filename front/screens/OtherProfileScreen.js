import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import IconButton from "../components/atoms/IconButton";
import Button from "../components/atoms/Button";
import axios from "axios";

// Local components import
import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import BookView from "../components/molecules/BookView";
import Paragraph from "../components/atoms/Paragraph";

import { AuthContext } from "../context/auth";
import { BookContext } from "../context/book";
import { theme } from "../core/theme";

const HMINUTE_MS = 30000;

export default function OtherProfileScreen({ route, navigation }) {
  const [savedBooks, setSavedBooks] = useContext(BookContext);
  const [state, setState] = useContext(AuthContext);
  const [email, setEmail] = useState("email");
  const [username, setUsername] = useState(route.params.username);
  const [readingList, setReadingList] = useState(0);
  const [works, setWorks] = useState(0);
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  // const [followed, setFollowed] = useState(false);
  // const [followText, setFollowText] = useState("");
  const [followed, setFollowed] = useState(route.params.followedAlready);
  const [followText, setFollowText] = useState(followed ? "Unfollow" : "Follow");
  useEffect(() => {
    if(followed){
      setFollowText("Unfollow");
    }else{
      setFollowText("Follow");
    }
  }, [followed]);

  var key_id = 0;

  useEffect(() => {
    gatherData();

    const interval = setInterval(() => {
      gatherData();
    }, HMINUTE_MS);

    return () => clearInterval(interval);
  }, [state]);

  const gatherData = () => {
    if (state) {
      if (state.user === null) {
        return;
      }
      setUsername(route.params.username);
      // Show the username and email of the logged user
      setEmail("email");
      setReadingList(savedBooks.length);

      fetchBooks(username);

      showFollowers(username);
    }
  };

  const showFollowers = async (username) => {
    if(route.params.followedAlready){
      setFollowed(true);
    }
    try {
      const resp = await axios.get(
        "http://localhost:8080/api/getFollowers",
        {
          params: {
            userID: username,
          },
        }
      );
      setFollowers(resp.data.followers.length);
      setFollowing(resp.data.following.length);
  }catch(e){
    console.log(e)
  }
  }

  // Get the user's work
  const fetchBooks = async (username) => {
    // to get the parameters passed in the SearchScreen -> route.params

    // When using an android emulator with expo-go
    // use localhost instead of localhost
    try {
      const resp = await axios.get(
        "http://localhost:8080/api/auth/getUserBooks",
        {
          params: {
            userID: username,
          },
        }
      );

      // If nothing changed with the user's works
      if (resp.data.message !== books) {
        setBooks(resp.data.message);
        setWorks(resp.data.message.length);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const viewBook = async (item) => {
    navigation.navigate("BookViewScreen", {
      author: item.username,
      title: item.title,
      content: item.content,
      views: item.views,
      otherProfile: true
    });
  };

  const followButton = async () => {
    if(!followed){
      try{
      const resp = await axios.get(
        "http://localhost:8080/api/followSomeone",
        {
          params: {
            userID: username,
            myUserID: state.user.username
          },
        }
      );
        setFollowers(followers + 1);
        setFollowText("Unfollow");
        setFollowed(true); 
      }catch(e){
        console.log(e);
      }
    }else{
      try{
      const resp = await axios.get(
        "http://localhost:8080/api/unfollowSomeone",
        {
          params: {
            userID: username,
            myUserID: state.user.username
          },
        }
      );
      setFollowers(followers - 1);
      setFollowText("Follow");
      setFollowed(false); 
      }catch(e){
        console.log(e);
      }
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    gatherData();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <DarkBackgroundS>
        <IconButton
                        icon="arrow-left"
                        iconColor={theme.colors.firstColors}
                        onPress={() => navigation.goBack()}
                        size={30}
                    />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header and title parts */}
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: "bold", color: "#64CCC5" }}>
                {" "}
                USERNAME:
              </Text>
              <Text> {username}</Text>
            </Text>

            <Button onPress={followButton} style={styles.followButon}>{followText}</Button>

            <View style={styles.statsContainer}>
            <Text style={styles.stats}>
              <Text style={styles.numbers}>
                {followers} {"\n"}
              </Text>
              <Text>Followers</Text>
            </Text>

            <Text style={styles.stats}>
              <Text style={styles.numbers}>
                {following} {"\n"}
              </Text>
              <Text>Following</Text>
            </Text>
            </View>
          </View>
        </View>

        <Paragraph style={styles.ParagraphStyle}>{username} Stories</Paragraph>

        <View style={[styles.scrollContainer, { flex: 6 }]}>
          {books &&
            books.map((item) => (
              <TouchableOpacity key={key_id++} onPress={() => viewBook(item)}>
                <BookView
                  key={key_id++}
                  NbViews={item.views}
                  imgData={item.image.data}
                  bookTitle={item.title}
                  bookTag={item.tag}
                  bookAuthor={username}
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </DarkBackgroundS>
  );
}

const styles = StyleSheet.create({
  infoText: { color: theme.colors.text, fontSize: 17, alignSelf: "center" },
  stats: { color: theme.colors.text, margin: 3 },

  statsContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  

  container: {
    flex: 2,
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
    paddingTop: 15,
  },

  subHeaderStyle: {
    alignSelf: "center",
    color: theme.colors.text,
    fontSize: 18,
  },
  scrollContainer: { flex: 5, borderRadius: 15, padding: 10 },
  info: { paddingBottom: 10, color: theme.colors.text },
  ParagraphStyle: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 15,
    bottom: -20,
    color: "#64CCC5",
    marginLeft: 10
  },
  followButon: {
    flex:1,
    alignSelf: "center"
  }
});
