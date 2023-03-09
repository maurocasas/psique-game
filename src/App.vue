<template>
  <div :class="`h-full flex flex-col grid grid-cols-${columns} bg-${sadnessColor} transition-all duration-500`">
    <div v-for="(x, xIndex) in grid" :key="`col-${xIndex}`" class="flex flex-col justify-between"
         >
      <div
          v-for="(y, yIndex) in x" :key="`row-${xIndex}-${yIndex}`"
          :class="[{
            'relative h-full transition-all duration-500': true,
          }, `bg-${sadnessColor}` ]"
      >
      <div
           :class="`h-full w-full flex items-center justify-center
           bg-gradient-to-${y.direction}
          from-${y.from}-${y.min}
          via-${y.from}-${y.max - y.min}
          to-${y.to}-${y.max}
          transition-all
          duration-1000
          relative
          background-animate`" :style="{animationDuration:`${y.duration}s`, opacity: y.opacity}">
      </div>

        <div :class="[
            `flex h-full w-full z-10 absolute inset-0 items-center justify-center text-4xl`,
            y.mood === 'happy' ? `animate-${y.animation}` : ''
            ]"
             :style="{opacity: y.opacity*3.5}">{{y.emoji}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import randomItem from 'random-item';

const config = {
  animation: [ 'wiggle', 'wiggle_left', 'wiggle_more' ],
  direction: ['br', 'bl', 'tr', 'tl'],
  colors: ['amber','indigo','emerald','rose','orange','pink','fuchsia',
    'yellow','lime','green','teal','cyan','sky','violet','purple'],
  emojis: {
    happy: ['🥹','😁','💕','🌟','❤️','🦄','💃','🥳','🤩','🥰','😍','😎','🕺🏻','🎖️'],
    sad: ['😔','😟','😩','😭','😖','💔','🫥','😥','🤬']
  }
}

export default {
  name: 'App',
  data: () => ({
    rows: 8,
    columns: 8,
    happy: 0,
    grid: [],
    sadness: 0,
    sadnessColor: 'zinc',
  }),
  mounted() {
    this.happy = localStorage.getItem('happy_items') ?? 0;
    console.log('mounted');
    this.createGrid();
    document.addEventListener( "keyup", this.pressed );
  },
  watch: {
    grid: {
      deep: true,
      handler() {
        this.calculateSadness();
      }
    }
  },
  methods: {
    calculateSadness() {
      if(this.grid.length === 0)
        return 0;

      let size = this.rows * this.columns;
      let zinc = this.grid
          .map(item => item.filter(y => y.from === 'zinc').length)
          .reduce((a,b) => a += b);
      let value = parseInt(parseInt((zinc * 100 / size) / 10) * 1.2);

      console.log({size,zinc,value})

      this.sadnessColor = value > 8 ? 'black' : ('zinc-' + (value * 100));
      this.sadness = value;
    },
    randomInt(max) {
      return Math.floor(Math.random() * max);
    },
    pressed(e) {
      e.preventDefault();
      console.log('pressed', e);

      if(e.key === 'ArrowUp') {
        this.happy++;
        localStorage.setItem('happy_items', this.happy);
        console.log('happy', this.happy);
        this.pushColor();
      }

      if(e.key === 'ArrowDown') {
        this.pushColor('zinc');
      }
    },
    createGrid() {
      let grid = JSON.parse(localStorage.getItem('grid') ?? '[]');

      if(grid.length === 0) {
        for (let x = 1; x <= this.columns; x++) {
          grid.push([]);

          for (let y = 1; y <= this.rows; y++) {
            let max = this.randomInt(8) + 4;
            let min = max - 3 <= 5 ? 5 : max - 3;
            max = max <= min ? min + 1 : max;
            max = max > 9 ? 9 : max;

            grid[x - 1].push(
                {
                  direction: randomItem(config.direction),
                  duration: this.randomInt(8) + 4,
                  from: 'white',
                  to: 'white',
                  via: 'white',
                  min: 100 * min,
                  max: 100 * max,
                  opacity: (this.randomInt(40))/100,
                  emoji: '',
                }
            )
          }
        }
      }

      this.grid = grid;
      this.saveGrid();
    },
    saveGrid() {
      localStorage.setItem('grid', JSON.stringify(this.grid))
      this.calculateSadness();
    },
    pushColor(color = null) {
      if(this.rows*this.columns < this.happy)
        return;

      if(color) {
        if(
            this.grid
                .map(item => item.filter(y => y.from === 'white').length)
                .reduce((a,b) => a += b) === 0
        )
          return;
      }

      let done = false;

      while(!done){
        let row = this.randomInt(this.rows);
        let column = this.randomInt(this.columns);
        let max = this.randomInt(7);
        let min = max - 3 <= 4 ? 4 : max - 3;
        max = max <= min ? min + 1 : max;
        max = max > 7 ? 7 : max;

        if((color && this.grid[row][column].from === 'white') ||
            (!color && ['zinc','white'].indexOf(this.grid[row][column].from) !== -1)) {
          this.grid[row][column] = {
            animation: randomItem(config.animation),
            mood: color ? 'sad' : 'happy',
            direction: randomItem(config.direction),
            duration: color ? 5 : this.randomInt(3) + 1,
            from: color ?? randomItem(config.colors),
            to: color ?? randomItem(config.colors),
            via: color ?? randomItem(config.colors),
            min: min * 100,
            max: max * 100,
            opacity: color ? (this.randomInt(10) + 5)/100 : 1,
            emoji: randomItem(config.emojis[color ? 'sad' : 'happy'])
          };

          done = true;
        }
      }
      this.saveGrid();
    },
  },
}
</script>
