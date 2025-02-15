# :zzz:

scroll to top smoothly

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .box {
        overflow-y: scroll;
        border: 1px solid red;
        width: 200px;
        height: 100px;
      }
    </style>
  </head>
  <body>
    <button id="btn">to top</button>
    <div class="box"></div>

    <script>
      function smoothScroll2top(el, target, duration) {
        const start = el.scrollTop
        const distance = target - start
        const startStamp = performance.now()

        function step(currentStamp) {
          const elapsed = currentStamp - startStamp
          const progress = Math.min(elapsed / duration, 1)
          el.scrollTop = start + distance * progress
          if (progress < 1) {
            requestAnimationFrame(step)
          }
        }

        requestAnimationFrame(step)
      }

      document.getElementById('btn').addEventListener('click', () => {
        const box = document.querySelector('.box')
        smoothScroll2top(box, 0, 500)
      })
    </script>
  </body>
</html>
```
