import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, TouchableHighlight } from 'react-native';
import _ from 'lodash';
import ContentBox from '../../components/ContentBox/ContentBox';
import ResolutionCardItem from './ResolutionCardItem';
import { Titles } from '../../Styles/Text';
import config from '../../Styles/config';
const { ThemeColors } = config;

/** ResolutionCard
 *  This component renders a card like element with resolution
 *  related data like title, image and some text.
 *
 *  This card is the outermost element in the card data model,
 *  which also contains an array of nested cards that we call
 *  ResolutionCardItem.
 */

class ResolutionCard extends Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
    this.incrementCard = this.incrementCard.bind(this);
    this.decrementCard = this.decrementCard.bind(this);
    this.state = {
      // cardIndex: Null means we render card. Number means we render cardItem[Number].
      cardIndex: this.mayRenderCard ? null : 0,
      total: props.data.cards.length
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cardIndex: 0,
      total: nextProps.data.cards.length
   });
}

  static get defaultProps() {
    return {
      data: {
        media: {
          url: '',
          type: null
        },
        title: '',
        text: ''
      }
    };
  }

  /**
   * mayRenderCard
   * @returns {boolean} Returns true if the data this component receives is su-
   * fficient to render a card. Returns false if data is missing.
   * If too much data is missing, then we skip the card, and jump directly to
   * rendering cardItems.
   */
  get mayRenderCard() {
    return false;
  }

  /**
   * press
   * Sets state field 'cardIndex' to 0.
   * This means that this component will not render it's card
   * anymore, but will instead render it's first cardItem (0, first in array)
   * To render the Card, cardIndex must be null.
   */
  press() {
    this.setState({ cardIndex: 0 });
  }

  /**
   * incrementCard
   * Increments the state field 'cardItem' by 1 step.
   * This means that this component will render the next item
   * in the cardItems array.
   */
  incrementCard() {
    if (this.state.cardIndex + 1 >= this.state.total) return;
    this.setState((prevState) => ({ cardIndex: prevState.cardIndex + 1 }));
  }

  /**
   * decrementCard
   * Renders previous cardItem.
   * If there is no previous cardItem (index 0), then we set cardIndex
   * no null, which means we render the card, not a cardItem.
   */
  decrementCard() {
    if (this.state.cardIndex <= 0) return this.setState({ cardIndex: null });
    this.setState((prevState) => ({ cardIndex: prevState.cardIndex - 1 }));
  }

  render() {
    const { media, title, text, cards: cardItems } = this.props.data;
    const { onCardFinalise } = this.props;

    const renderMedia = () => {
      let node, asset;
      switch (media.type) {
        case 'image':
          node = (
            <Image
              source={{ uri: media.url }}
              style={{ width: '100%', height: 250 }}
              resizeMode="contain"
            />
          );
          break;

        default:
          console.warn('Unsupported media type (ResolutionCard.js)', media);
          return null;
      }
      return <View style={Media.container}>{node}</View>;
    };

    const renderContent = () => (
      <View style={Content.container}>
        <Text style={[Content.centeredText, Titles.secondary]}>{title}</Text>
        <Text style={Content.centeredText}>{text}</Text>
      </View>
    );

    const renderCard = () => {
      return (
        <TouchableHighlight onPress={this.press} style={Card.container}>
          <ContentBox style={Card.box}>
            {renderMedia()}
            {renderContent()}
          </ContentBox>
        </TouchableHighlight>
      );
    };

    const renderCardItem = (card) => {
      const meta = { index: this.state.cardIndex, total: this.state.total };
      return (
        <ResolutionCardItem
          data={card}
          meta={meta}
          onPrimaryPress={this.incrementCard}
          onSecondaryPress={this.decrementCard}
          onFinalise={onCardFinalise}
        />
      );
    };

    return _.isNull(this.state.cardIndex) && this.mayRenderCard
      ? renderCard()
      : renderCardItem(cardItems[this.state.cardIndex]);
  }
}

const Card = StyleSheet.create({
  container: {
    // backgroundColor: '#3df1ce',
    marginTop: 10,
    height: '80%',
    marginHorizontal: 30
  },
  box: {
    backgroundColor: ThemeColors.spatial.containerBG, //'#71ade9'
    height: '100%'
  }
});

const Media = StyleSheet.create({
  container: {
    // backgroundColor: '#efa4ec',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingTop: 40
  }
});

const Content = StyleSheet.create({
  container: {
    // backgroundColor: '#7a771c',
    flex: 2,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  centeredText: {
    textAlign: 'center'
  }
});

export default ResolutionCard;
