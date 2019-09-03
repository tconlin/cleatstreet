'use strict';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#1E90FF'
  },
  authContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 60
  },
  appTitle: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '200',
    marginBottom: 30
  },
  roomsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  roomsHeader: {
    color: '#fff',
    fontSize: 28,
    top: 20
  },
  roomsInputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#f9f9f9',
    borderBottomWidth: 2,
  },
  roomsInput: {
    flex: 1,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    color: '#1E90FF',
    borderColor: '#f9f9f9',
    borderWidth: 2,
    borderRadius: 4,
    margin: 10
  },
  roomsNewButton: {
    alignItems: 'center',
    marginRight: 20
  },
  roomsNewButtonText: {
    color: '#1E90FF',
    fontSize: 18
  },
  roomsListContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  roomLi: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  roomLiText: {
    color: '#1E90FF',
    fontSize: 22,
  },
  messagesHeader: {
    backgroundColor: '#1E90FF'
  },
  messagesTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400'
  },
  messagesBackTitle: {
    color: '#fff'
  }
});

export default styles;