<div>
  <a class="MonsterDNA" href="/">
    <img src="/adn-0.svg" alt="Revenir au choix de l’ADN" />
    <span class="MonsterIndicator__name">Revenir au choix de l’ADN</span>
  </a>
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }
  .MonsterDNA {
    position: relative;
    display: block;
    border-bottom: 3px solid transparent;
    &:hover, &:focus {
      border-bottom: 3px solid black;
    }
  }
  .MonsterDNA img {
    display: block;
    height: 3.5rem;
    pointer-events: none;
    padding-bottom: .5rem;
  }
  .MonsterIndicator__name {
    display: none;
  }
  .MonsterDNA:hover .MonsterIndicator__name,
  .MonsterDNA:focus .MonsterIndicator__name {
    position: absolute;
    white-space: nowrap;
    text-align: right;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 0 0 1rem;
    color: black;
  }
  .MonsterDNA:focus .MonsterIndicator__name {
    display: block;
  }
  @media (hover: hover) {
    .MonsterDNA:hover .MonsterIndicator__name {
      display: block;
    }
  }
</style>