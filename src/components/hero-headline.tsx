"use client";

import { useEffect, useState } from "react";

const words = ["expériences", "solutions", "interfaces"];

export function HeroHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleText, setVisibleText] = useState(words[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let delay = deleting ? 48 : 92;

    if (!deleting && visibleText === currentWord) {
      delay = 1700;
    } else if (deleting && visibleText.length === 0) {
      delay = 320;
    }

    const timer = window.setTimeout(() => {
      if (!deleting && visibleText === currentWord) {
        setDeleting(true);
      } else if (deleting && visibleText.length === 0) {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
      } else if (deleting) {
        setVisibleText(currentWord.slice(0, visibleText.length - 1));
      } else {
        setVisibleText(currentWord.slice(0, visibleText.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, visibleText, wordIndex]);

  return (
    <h1 className="hero__headline">
      Des idées en<br />
      <span className="hero__typed-word" aria-label={words[wordIndex]}>
        <span aria-hidden="true">{visibleText}</span>
        <span className="hero__caret" aria-hidden="true" />
      </span>{" "}
      <span>digitales</span><span className="hero__period">.</span>
    </h1>
  );
}
