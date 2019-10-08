import { StyleSheet } from 'react-native';

const fontSize = 17;

export default StyleSheet.create({
  teamRow: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chatTeamRow: {
    //paddingHorizontal: 22,
    //paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  teamIconContainer: {
    width: 50,
    alignItems:'center',
    justifyContent:'center'
  },
  dateContainer: {
    width: 150,
    alignItems:'center',
    justifyContent:'center'
  },
  teamIcon: {
    height: 50,
    width: 42,
    resizeMode: 'contain'
  },
  date: {
    //height: 50,
    width: 150,
    textAlign: 'center'
  },
  teamNameContainer: {
    
    //justifyContent: 'center'
  
  },
  teamName: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },
  time: {
    color: '#000',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center'
  },
  separator: {
    marginHorizontal: 16,
    backgroundColor: '#f9f9f9',
    flex: 1,
    height: 1
  },
  recordContainer: {
    flexDirection: 'row'
  },
  wins: {
    color: '#174e70',
    fontWeight: '800',
    fontSize
  },
  hyphen: {
    paddingHorizontal: 10,
    fontSize
  },
  losses: {
    color: '#c42813',
    fontWeight: 'bold',
    fontSize
  },
  ratio: {
    color: '#fff',
    paddingHorizontal: 8,
    fontSize
  }
});