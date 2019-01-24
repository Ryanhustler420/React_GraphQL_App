import Item from '../components/Item';
import {shallow} from 'enzyme';

// https://airbnb.io/enzyme/docs/api/ShallowWrapper/shallow.html <- refer

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
};

describe ('<Item />', () => {
  it ('renders the image properly', () => {
    const wrapper = shallow (<Item item={fakeItem} />);
    const image = wrapper.find ('img');
    expect (image.props ().src).toBe (fakeItem.image);
    expect (image.props ().alt).toBe (fakeItem.title);
  });

  it ('renders the priceTag and title', () => {
    const wrapper = shallow (<Item item={fakeItem} />);
    const PriceTag = wrapper.find ('PriceTag');
    expect (PriceTag.dive ().text ()).toBe ('$50');
    expect (PriceTag.children ().text ()).toBe ('$50');

    expect (wrapper.find ('Title a').text ()).toBe (fakeItem.title);
    // console.log(wrapper.debug());
  });

  it ('renders out the buttons properly', () => {
    const wrapper = shallow (<Item item={fakeItem} />);
    // console.log(wrapper.debug());
    const buttonList = wrapper.find ('.buttonList');
    expect (buttonList.children ()).toHaveLength (3);
    expect (buttonList.find ('Link').exists()).toBe (true);
    expect (buttonList.find ('AddToCart').exists()).toBe (true);
    expect (buttonList.find ('DeleteItem').exists()).toBe (true);
  });
});
