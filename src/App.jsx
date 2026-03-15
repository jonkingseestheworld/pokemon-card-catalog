import { useState, useEffect } from 'react'
import pokemonLogo   from './assets/pokemon-logo.png'
import ballClosed    from './assets/pokemon-ball.png'
import ballOpen      from './assets/pokemon-ball-open.png'
import battleGif     from './assets/loading-screen-battle.gif'
import './App.css'

const pokemons = [
  { id: 1,   name: "Bulbasaur",  type: "Grass",    hp: 45,  attack: 49  },
  { id: 4,   name: "Charmander", type: "Fire",     hp: 39,  attack: 52  },
  { id: 7,   name: "Squirtle",   type: "Water",    hp: 44,  attack: 48  },
  { id: 25,  name: "Pikachu",    type: "Electric", hp: 35,  attack: 55  },
  { id: 6,   name: "Charizard",  type: "Fire",     hp: 78,  attack: 84  },
  { id: 9,   name: "Blastoise",  type: "Water",    hp: 79,  attack: 83  },
  { id: 3,   name: "Venusaur",   type: "Grass",    hp: 80,  attack: 82  },
  { id: 150, name: "Mewtwo",     type: "Psychic",  hp: 106, attack: 110 },
  { id: 39,  name: "Jigglypuff", type: "Normal",   hp: 115, attack: 45  },
  { id: 143, name: "Snorlax",    type: "Normal",   hp: 160, attack: 110 },
  { id: 94,  name: "Gengar",     type: "Ghost",    hp: 60,  attack: 65  },
  { id: 131, name: "Lapras",     type: "Water",    hp: 130, attack: 85  },
  { id: 133, name: "Eevee",      type: "Normal",   hp: 55,  attack: 55  },
  { id: 149, name: "Dragonite",  type: "Dragon",   hp: 91,  attack: 134 },
  { id: 59,  name: "Arcanine",   type: "Fire",     hp: 90,  attack: 110 },
  { id: 65,  name: "Alakazam",   type: "Psychic",  hp: 55,  attack: 50  },
  { id: 68,  name: "Machamp",    type: "Fighting", hp: 90,  attack: 130 },
  { id: 76,  name: "Golem",      type: "Rock",     hp: 80,  attack: 120 },
  { id: 130, name: "Gyarados",   type: "Water",    hp: 95,  attack: 125 },
  { id: 148, name: "Dragonair",  type: "Dragon",   hp: 61,  attack: 84  },
]

const FILTER_ROW1 = ['Show All', 'Grass', 'Fire', 'Water', 'Electric', 'Psychic']
const FILTER_ROW2 = ['Normal', 'Ghost', 'Dragon', 'Fighting', 'Rock']

const MAX_HP     = Math.max(...pokemons.map(p => p.hp))
const MAX_ATTACK = Math.max(...pokemons.map(p => p.attack))

function StatBar({ label, value, max }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="stat">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function PokemonCard({ pokemon, revealed, flipped, onImageClick }) {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  const showSprite = flipped ? !revealed : revealed
  return (
    <div className={`card type-${pokemon.type.toLowerCase()}`}>
      <div className="card-header">
        <h2 className="card-name">{pokemon.name}</h2>
        <span className="card-type">{pokemon.type}</span>
      </div>
      <div className="card-image-wrapper">
        <div className="card-image-circle" onClick={onImageClick} style={{ cursor: 'pointer' }}>
          {showSprite ? (
            <img src={spriteUrl}   alt={pokemon.name}   className="card-sprite" />
          ) : (
            <img src={ballClosed}  alt="Pokémon hidden" className="card-sprite card-sprite--ball" />
          )}
        </div>
      </div>
      <div className="card-stats">
        <StatBar label="HP"     value={pokemon.hp}     max={MAX_HP}     />
        <StatBar label="Attack" value={pokemon.attack} max={MAX_ATTACK} />
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <img src={pokemonLogo} alt="Pokémon" className="loading-logo" />
      <div className="loading-card">
        <img src={battleGif} alt="Loading battle..." className="loading-gif" />
      </div>
    </div>
  )
}

function App() {
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('Show All')
  const [revealed,   setRevealed]   = useState(false)
  const [flippedIds, setFlippedIds] = useState(new Set())

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />

  const visiblePokemons = pokemons.filter(p =>
    filter === 'Show All' ? true : p.type === filter
  )

  return (
    <div className="app">
      <div className="sticky-top">
        <header className="site-header">
          <img src={pokemonLogo} alt="Pokémon" className="site-logo" />

          <button
            className="ball-toggle"
            onClick={() => { setRevealed(r => !r); setFlippedIds(new Set()) }}
            title={revealed ? 'Reveal Pokémon' : 'Hide Pokémon'}
          >
            <img
              src={revealed ? ballClosed : ballOpen}
              alt={revealed ? 'Pokémon ball open icon' : 'Pokémon ball close icon'}
              className="ball-icon"
            />
          </button>
        </header>

        <nav className="filter-bar">
          {[FILTER_ROW1, FILTER_ROW2].map((row, i) => (
            <div key={i} className="filter-row">
              {row.map(option => (
                <button
                  key={option}
                  className={`filter-btn${filter === option ? ' active' : ''}`}
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <main className="card-grid">
        {visiblePokemons.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            revealed={revealed}
            flipped={flippedIds.has(pokemon.id)}
            onImageClick={() => setFlippedIds(prev => {
              const next = new Set(prev)
              next.has(pokemon.id) ? next.delete(pokemon.id) : next.add(pokemon.id)
              return next
            })}
          />
        ))}
      </main>
    </div>
  )
}

export default App
