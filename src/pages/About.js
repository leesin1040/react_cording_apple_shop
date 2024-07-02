import { useState, useTransition, useDeferredValue } from 'react';
let a = new Array(10000).fill(0);
function About() {
  let [name, setName] = useState('');
  let [isPending, startTransition] = useTransition();
  let deferredName = useDeferredValue(name);

  return (
    <div>
      <input
        onChange={(e) =>
          startTransition(() => {
            setName(e.target.value);
          })
        }
      />
      {isPending ? <p>로딩중...</p> : null}
      {a.map(() => {
        return <p>{deferredName}</p>;
      })}
    </div>
  );
}

export default About;
