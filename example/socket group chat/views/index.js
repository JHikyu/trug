const adjectives = ['Careful', 'Nice', 'Sleepy', 'Fantastic', 'Amusing', 'Excited', 'Bored', 'Funny', 'Fast'];
const animals = ['Dog','Cat','Horse','Lion','Tiger','Elephant','Giraffe','Monkey','Panda','Lizard','Turtle','Snake','Fish'];
const colors = ['Red','Blue','Green','Yellow','Orange','Purple','Pink','Black','White','Brown','Grey','Silver','Gold'];

const randomValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = async (trug) => {
    //* Run once on page load [index.html]

    // Generate name for the user
    const adjective = randomValue(adjectives);
    const animal = randomValue(animals);
    const color = randomValue(colors);
    const name = `${adjective} ${animal}`;
    const id = `${adjective}-${animal}-${color}-${Math.floor(Math.random() * 100)}`;


    return {
        data: {
            name,
            id
        }
    };
};