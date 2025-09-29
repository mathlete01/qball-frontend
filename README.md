## qball-frontend-2

QWERTYBall is a little browser game built with a Javascript frontend and a Ruby on Rails backend.

### How to Use

QWERTYBall was built on Ruby 2.6.1 and uses npm to install node modules. You'll probably need a similar set-up to get it to run correctly.

#### Installation

1. First, clone or download the [frontend_breakout repo](https://github.com/mathlete01/frontend_breakout) and [backend_breakout_api repo](https://github.com/mathlete01/backend_breakout_api)
2. Put both files into a directory called `keyboard_breakout`
3. `cd` into the `frontend_breakout` directory and run `npm install` to install all the required module.
4. `cd ..` once they're installed to get back into the `keyboard_breakout` directory.
5. `cd` into the `backend_breakout_api` directory and run `npm install` to install all the required module.
6. Enter `rails db:migrate` to run the database migrations.
7. Start the application by entering `rails s`.
8. `cd ..` to get back into the `keyboard_breakout` directory.
9. Finally, `cd` into the `frontend_breakout_api` directory and enter `open app/index.html` to see it running.

#### Using the app

1. On the homepage, choose 'Start Game'.
2. The goal is to keep the ball from escaping the bounds of the keyboard. Type the keys so that the ball ricochets in the other direction to keep the ball in play.
3. The ball starts out slowly, but gets faster with each collision.
4. At the end of the game, if you are pleased with your score go ahead and enter your name. They database will keep track of your top 3 scores and the top 10 scores overall. Good luck!

#### Game Architecture

![QWERTYBall Architecture](https://github.com/mathlete01/frontend_breakout/raw/main/assets/images/QWERTYBall_Architecture.png)
