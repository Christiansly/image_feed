import Avatar from './components/Avatar';
import React from 'react';
import {
  AsyncStorage,
  View,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';

import AuthorRow from './components/AuthorRow';
import Card from './components/Card';
import CardList from './components/CardList';
import Feed from './screens/Feed';
import Comments from './screens/Comments';

const items = [
  {id: 0, author: 'Bob Ross'},
  {id: 1, author: 'Chuck Norris'},
];
const ASYNC_STORAGE_COMMENTS_KEY = 'ASYNC_STORAGE_COMMENTS_KEY';
export default class App extends React.Component {
  state = {
    commentsForItem: {},
    showModal: false,
    selectedItemId: null,
  };
  async componentDidMount() {
    try {
      const commentsForItem = await AsyncStorage.getItem(
        ASYNC_STORAGE_COMMENTS_KEY,
      );
      this.setState({
        commentsForItem: commentsForItem ? JSON.parse(commentsForItem) : {},
      });
    } catch (e) {
      console.log('Failed to load comments');
    }
  }
  openCommentScreen = (id) => {
    this.setState({
      showModal: true,
      selectedItemId: id,
    });
  };
  closeCommentScreen = () => {
    this.setState({
      showModal: false,
      selectedItemId: null,
    });
  };
  onSubmitComment = (text) => {
    const {selectedItemId, commentsForItem} = this.state;
    const comments = commentsForItem[selectedItemId] || [];
    const updated = {
      ...commentsForItem,
      [selectedItemId]: [...comments, text],
    };
    this.setState({commentsForItem: updated});
    try {
      AsyncStorage.setItem(ASYNC_STORAGE_COMMENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log('Failed to save comment', text, 'for', selectedItemId);
    }
  };
  render() {
    const {commentsForItem, showModal, selectedItemId} = this.state;
    return (
      <View style={styles.container}>
        <Feed
          style={styles.feed}
          commentsForItem={commentsForItem}
          onPressComments={this.openCommentScreen}
        />
        <Modal
          visible={showModal}
          animationType="slide"
          onRequestClose={this.closeCommentScreen}>
          <Comments
            style={styles.container}
            comments={commentsForItem[selectedItemId] || []}
            onClose={this.closeCommentScreen}
            onSubmitComment={this.onSubmitComment}
            // ...
          />
        </Modal>
      </View>
    );
  }
}

const platformVersion =
  Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : Platform.Version;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
  },
  comments: {
    flex: 1,
  },
});
