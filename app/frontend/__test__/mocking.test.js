// mocking :- which reach outside of your application to different servics where we use mocking
//            Like API calls

function Person (name, foods) {
  this.name = name;
  this.foots = foods;
}

Person.prototype.fetchFavFoods = function () {
  return new Promise ((resolve, reject) => {
    //   Simulate an API
    setTimeout (() => resolve (this.foods), 2000);
  });
};

// testing...
describe ('mocking learning', () => {
  it ('mocks a reg function', () => {
    const fetchDogs = jest.fn ();
    fetchDogs ('snickers');
    expect (fetchDogs).toHaveBeenCalled ();
    expect (fetchDogs).toHaveBeenCalledWith ('snickers');

    fetchDogs ('hugo');
    expect (fetchDogs).toHaveBeenCalledTimes (2);
  });

  it ('can create a Person', () => {
    const me = new Person ('Gaurav', ['Briyani', 'Burgur']);
    expect (me.name).toBe ('Gaurav');
  });

  it ('can fetch foods', async () => {
    const me = new Person ('Gaurav', ['Briyani', 'Burgur']);
    // mock the favFoods function
    me.fetchFavFoods = jest.fn ().mockResolvedValue (['sushi', 'ramen']);
    const favFoods = await me.fetchFavFoods ();
    expect (favFoods).toContain ('sushi');
  });
});
