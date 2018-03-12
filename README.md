# Taking trains:
Program using directional graphs to plan train rides.

# Task: 
The local commuter railroad services a number of towns in Kiwiland.  Because of monetary concerns, all of the tracks are 'one-way.'  That is, a route from Kaitaia to Invercargill does not imply the existence of a route from Invercargill to Kaitaia.  In fact, even if both of these routes do happen to exist, they are distinct and are not necessarily the same distance!
 
The purpose of this problem is to help the railroad provide its customers with information about the routes.  In particular, you will compute the distance along a certain route, the number of different routes between two towns, and the shortest route between two towns.

# Approach:

I decided to solve this assignment using Node which allows me to easily turn the program into a web service in the future that can inform users about optimised train connections. 

As suggested in the task specifcations I used TDD which I really enjoy since it forces me to structure the task and therefore the future code beforehand. Also it makes debugging the program easier while adding new features. I picked the directed graph assigment since it is something I have never done before. I always had a special interest for data visualisation, so any issue that offers itself to be solved visually is very attractive to me. 

After making a bunch of sketches I realised that, to my surprise and out of luck, one of the subtasks can be solved with a algorithm that I just learned about last week. The Belman-Ford algorithm. The idea of it is to keep checking if each connection between nodes is actually the shortes one possible. Since I am a self taught programmer for the most part I constantly try to teach myself new computer science knowledge which really helped me with this task. 
It was really exciting to apply it in JS to an actual problem. 

For the last part of the exercise I represented the directed graph as a linked list which compared to an array should have the advantage of being faster when adding nodes (here: cities)to it.  

Test output after completing task:

![](docs/test.png)

The whole task was a very intersting challenge for me since it requires some knowledge I have just recently acquired.

# UPDATE:
Today, shortly before committing this exercise, I realised that I was happy to fast with the last subtask number 10. I must admit that the tests where passing so I was glad but now I see that it is only the beginning of the solution. Instead of counting the distance passed for each possible connection I summed up the distance per city which by chance also gave a correct output. The solution would be to track the distance of each connection separately and write method to go along each linked list properly concatenating each visited city to check if the example connections where all found. The 3 days I had to finalise the exercise are now almost over and I will try to complete the solution for myself afterwards. I really enjoyed this assignment!!   

# Running it:

Requires Node to be installed.
I'm working with version v8.6.0.

To install dependencies ( if you do not have yarn instaled yet find the installation guide for each OS here https://yarnpkg.com/en/docs/install)
```
yarn install
```

To run tests:
```
yarn test
```

To lint code:
```
yarn lint
```

To see final output of program:
```
node index
```

Example output:
![Tests](./docs/output.png)


# Next possible steps:
- [ ] test also helper functions e.g. createLinkedList()

- [ ] create a shared table (between different substasks) to memorise properties of connections already passed which ideally is build by it's own class

- [ ] create an API to allow requesting different functionalities of the program and provide it to a front end application that visualises train connections

- [ ] turn app into a microservice that is inside of a container to be linked with other apps in a bigger cluster of services

- [ ] use Babel to turn ES6 into older JS versions that are supported in more environments

- [ ] add a proper build process e.g. with gulp or webpack

