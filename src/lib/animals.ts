import catWild from "@/assets/cat-wild.jpg";
import catBirds from "@/assets/cat-birds.jpg";
import catReptiles from "@/assets/cat-reptiles.jpg";
import catAquatic from "@/assets/cat-aquatic.jpg";
import imgLion from "@/assets/animal-lion.jpg";
import imgElephant from "@/assets/animal-elephant.jpg";
import imgCheetah from "@/assets/animal-cheetah.jpg";
import imgTiger from "@/assets/animal-tiger.jpg";
import imgPeacock from "@/assets/animal-peacock.jpg";
import imgParrot from "@/assets/animal-parrot.jpg";
import imgFlamingo from "@/assets/animal-flamingo.jpg";
import imgSnake from "@/assets/animal-snake.jpg";
import imgCrocodile from "@/assets/animal-crocodile.jpg";
import imgIguana from "@/assets/animal-iguana.jpg";
import imgClownfish from "@/assets/animal-clownfish.jpg";
import imgShark from "@/assets/animal-shark.jpg";
import imgTurtle from "@/assets/animal-turtle.jpg";

export type AnimalCategory = "wild" | "birds" | "reptiles" | "aquatic";

export interface Animal {
  slug: string;
  name: string;
  category: AnimalCategory;
  emoji: string;
  image: string;
  species: string;
  habitat: string;
  diet: string;
  summary: string;
  facts: string[];
  /** Theme accent used on the detail page (CSS color / gradient token reference). */
  accent: string;
}

export const categories = [
  { slug: "wild", name: "Wild Animals", emoji: "🦁", image: catWild, description: "Big cats, elephants & roaming giants", color: "from-amber-600 to-orange-700", accent: "oklch(0.55 0.15 50)" },
  { slug: "birds", name: "Birds", emoji: "🦜", image: catBirds, description: "Colorful songs of the canopy", color: "from-emerald-500 to-teal-600", accent: "oklch(0.55 0.14 165)" },
  { slug: "reptiles", name: "Reptiles", emoji: "🐍", image: catReptiles, description: "Cold-blooded marvels", color: "from-lime-600 to-green-700", accent: "oklch(0.50 0.15 140)" },
  { slug: "aquatic", name: "Aquatic Animals", emoji: "🐠", image: catAquatic, description: "Wonders beneath the surface", color: "from-cyan-500 to-blue-700", accent: "oklch(0.55 0.15 230)" },
] as const;

export const animals: Animal[] = [
  { slug: "lion", name: "Lion", category: "wild", emoji: "🦁", image: imgLion, accent: "oklch(0.55 0.16 55)", species: "Panthera leo", habitat: "African savannas & grasslands", diet: "Carnivore — antelope, zebra, buffalo", summary: "The lion is the only truly social cat, living in family groups called prides. Males are recognised by their iconic mane.", facts: ["A lion's roar can be heard up to 8 km away.", "Female lions do most of the hunting.", "Cubs are born with spots that fade with age."] },
  { slug: "elephant", name: "Elephant", category: "wild", emoji: "🐘", image: imgElephant, accent: "oklch(0.45 0.05 60)", species: "Loxodonta africana", habitat: "Savannas, forests & deserts of Africa", diet: "Herbivore — grasses, bark, fruit", summary: "Elephants are the largest land animals on Earth, known for their intelligence, memory, and tight-knit family bonds.", facts: ["They can recognize themselves in a mirror.", "Their trunks have over 40,000 muscles.", "They mourn and remember their dead."] },
  { slug: "cheetah", name: "Cheetah", category: "wild", emoji: "🐆", image: imgCheetah, accent: "oklch(0.62 0.14 70)", species: "Acinonyx jubatus", habitat: "Open plains of Africa", diet: "Carnivore — gazelles & small antelope", summary: "The cheetah is the fastest land animal, capable of explosive bursts of speed up to 110 km/h.", facts: ["Goes from 0 to 100 km/h in three seconds.", "Cannot roar — they chirp and purr.", "Black 'tear marks' reduce sun glare."] },
  { slug: "tiger", name: "Tiger", category: "wild", emoji: "🐅", image: imgTiger, accent: "oklch(0.55 0.18 40)", species: "Panthera tigris", habitat: "Asian forests & mangroves", diet: "Carnivore — deer, wild boar", summary: "The tiger is the largest cat species, a solitary apex predator with a striped coat as unique as a fingerprint.", facts: ["No two tigers have identical stripe patterns.", "Excellent swimmers, often cooling off in water.", "Their night vision is six times better than ours."] },
  { slug: "peacock", name: "Peacock", category: "birds", emoji: "🦚", image: imgPeacock, accent: "oklch(0.45 0.18 250)", species: "Pavo cristatus", habitat: "Forests of South Asia", diet: "Omnivore — seeds, insects, small reptiles", summary: "Famous for the male's spectacular iridescent train used in courtship displays.", facts: ["The 'eyes' on the train are called ocelli.", "They can fly despite their long trains.", "A group is called an 'ostentation'."] },
  { slug: "parrot", name: "Parrot", category: "birds", emoji: "🦜", image: imgParrot, accent: "oklch(0.55 0.2 25)", species: "Psittaciformes", habitat: "Tropical & subtropical regions", diet: "Omnivore — fruit, nuts, seeds", summary: "Parrots are intelligent, vibrantly colored birds known for vocal mimicry and strong pair bonds.", facts: ["Some parrots live over 80 years.", "They use their feet like hands.", "Many species mate for life."] },
  { slug: "flamingo", name: "Flamingo", category: "birds", emoji: "🦩", image: imgFlamingo, accent: "oklch(0.72 0.14 15)", species: "Phoenicopterus", habitat: "Shallow lagoons & lakes", diet: "Omnivore — algae, brine shrimp", summary: "Flamingos get their pink color from carotenoids in their food. They often stand on one leg to conserve heat.", facts: ["Their knees actually bend forward — those are ankles.", "They feed with their heads upside down.", "A flock is called a 'flamboyance'."] },
  { slug: "snake", name: "Snake", category: "reptiles", emoji: "🐍", image: imgSnake, accent: "oklch(0.55 0.18 145)", species: "Serpentes", habitat: "All continents except Antarctica", diet: "Carnivore — rodents, eggs, fish", summary: "Snakes are limbless reptiles that 'see' the world through scent and vibration.", facts: ["They smell with their tongues.", "Some can survive months without food.", "There are over 3,000 species worldwide."] },
  { slug: "crocodile", name: "Crocodile", category: "reptiles", emoji: "🐊", image: imgCrocodile, accent: "oklch(0.38 0.07 130)", species: "Crocodylidae", habitat: "Tropical rivers & wetlands", diet: "Carnivore — fish, mammals, birds", summary: "Crocodiles are ancient apex predators that have remained largely unchanged for over 200 million years.", facts: ["They have the strongest bite of any animal.", "They can hold their breath for over an hour.", "Mothers gently carry hatchlings in their jaws."] },
  { slug: "iguana", name: "Iguana", category: "reptiles", emoji: "🦎", image: imgIguana, accent: "oklch(0.55 0.16 150)", species: "Iguana iguana", habitat: "Rainforests of Central & South America", diet: "Herbivore — leaves, fruit, flowers", summary: "Iguanas are large arboreal lizards with a third 'parietal eye' on top of their heads that detects light and movement.", facts: ["They can detach their tail to escape predators.", "Excellent swimmers — they can hold breath 30 min.", "Communicate via head-bobbing."] },
  { slug: "clownfish", name: "Clownfish", category: "aquatic", emoji: "🐠", image: imgClownfish, accent: "oklch(0.65 0.2 40)", species: "Amphiprioninae", habitat: "Warm coral reefs", diet: "Omnivore — algae, plankton", summary: "Clownfish live in symbiosis with sea anemones, immune to their stings.", facts: ["All clownfish are born male.", "They never stray far from their host anemone.", "They communicate through clicks and pops."] },
  { slug: "shark", name: "Shark", category: "aquatic", emoji: "🦈", image: imgShark, accent: "oklch(0.40 0.12 240)", species: "Selachimorpha", habitat: "Oceans worldwide", diet: "Carnivore — fish, seals, plankton (whale shark)", summary: "Sharks have ruled the oceans for over 400 million years and come in over 500 distinct species.", facts: ["They can detect a drop of blood in an Olympic pool.", "Their skeletons are made of cartilage, not bone.", "Some species never stop swimming."] },
  { slug: "turtle", name: "Sea Turtle", category: "aquatic", emoji: "🐢", image: imgTurtle, accent: "oklch(0.50 0.14 210)", species: "Chelonioidea", habitat: "Tropical & temperate oceans", diet: "Omnivore — jellyfish, seagrass, algae", summary: "Sea turtles are ancient mariners that navigate thousands of kilometers using Earth's magnetic field.", facts: ["Females return to their birth beach to nest.", "They can live over 100 years.", "Hatchling sex depends on sand temperature."] },
];

export const animalsBySlug = Object.fromEntries(animals.map(a => [a.slug, a]));
export const animalsByCategory = (cat: AnimalCategory) => animals.filter(a => a.category === cat);
