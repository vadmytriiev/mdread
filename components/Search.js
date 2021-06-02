import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './search.module.css'
// import { getMatchedLines } from '../lib/posts' 

export default function Search() {

  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])

  const searchEndpoint = (query) => `/api/search?q=${query}`

  const onChange = useCallback((event) => {
    const query = event.target.value;
    setQuery(query)
    if (query.length) {
      fetch(searchEndpoint(query))
        .then(res => res.json())
        .then(res => {
         
          var lines = getMatchedLines(res.results, query)
          //setResults(res.results)
          setResults(lines)
        })
    } else {
      setResults([])
    }
  }, [])

  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div
      className={styles.container}
      ref={searchRef}
    >
      <input
        className={styles.search}
        onChange={onChange}
        onFocus={onFocus}
        placeholder='Search posts'
        type='text'
        value={query}
      />
      { active && results.length > 0 && (
        <ul className={styles.results}>
          {results.map(({ id, content }) => (
            <li className={styles.result} key={id}>
              <Link href="/files/[id]" as={`/files/${id}`}>
                <a>{content}</a>
              </Link>
            </li>
          ))}
        </ul>
      ) }
    </div>
  )
}

export function getMatchedLines(array, value) {
  var result = [];
  for(var item of array){
    var res = {id: item.id}
    var match_index = item.content.indexOf(value);
    if(match_index){
      var lines = item.content.split(/\r\n|\r|\n/g);
      console.log(lines)
      lines = lines.filter(line => line.toLowerCase().includes(value))
      if(lines.length){
        res.content = lines[0];
      }else{
        res.content = '';
      }
    }
    result.push(res);
  }
  return result;
}