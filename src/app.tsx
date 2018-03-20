import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode';
//import Realm from 'realm';

import Networking from './networking';
import Identity from './identity';
import Peer from './interfaces/peer';

interface State {
  pubKey: string;
  privKey: string;
  listening: string;
  peers: Peer[];
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { pubKey: '', privKey: '', listening: '', peers: [] };
  }

  onPeerFound(peers) {
    let state = this.state;
    state.peers = peers;
    this.setState(state);
  };

  componentDidMount() {
    const networking = new Networking();
    const identity = new Identity();

    identity.get().then((id: { pubKey: string }) => {
      console.log('identity get', id);
      let state = this.state;
      state.pubKey = id.pubKey;
      this.setState(state);
    });

    networking.discover();
    networking.onPeersFound = this.onPeerFound.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        <Text>{this.state.listening}</Text>
        <Text>Public key: {this.state.pubKey}</Text>
        <QRCode
          value={this.state.pubKey}
          size={200}
          bgColor='purple'
          fgColor='white'/>
        <Text>Peers:</Text>
        {this.state.peers.map((peer, i) =>
          <Text key={i}>{peer.host}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
