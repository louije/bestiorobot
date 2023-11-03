
<div class="AudioStarter">
    <button>Démarrer !</button>
</div>

<style>
  .AudioStarter {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
    background: rgba(255, 255, 255, .33);
  }
  button {
    background: var(--accent-color);
    font-family: NectoMono, sans-serif;
    color: white;
    border: none;
    padding: 1.5rem;
    font-size: 2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    user-select: none;
    box-shadow: 3px 6px 5px rgba(0, 0, 0, 0.25);
  }

  button:hover,
  button:focus {
    box-shadow: 3px 6px 5px rgba(0, 0, 0, 0.33);
  }
  button:active {
    top: 2px;
    left: 2px;
    box-shadow: 2px 4px 2.5px rgba(0, 0, 0, 0.25);
  }
</style>
