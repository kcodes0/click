export type MathProblem = {
  id: number;
  category: "algebra" | "number-theory" | "combinatorics" | "geometry";
  statement: string;
  answer: string;
  difficulty: number;
};

export const PROBLEMS: MathProblem[] = [
  // ── ALGEBRA ──────────────────────────────────────────────────────
  {
    id: 1,
    category: "algebra",
    statement:
      "If $x + \\dfrac{1}{x} = 5$, find $x^4 + \\dfrac{1}{x^4}$.",
    answer: "527",
    difficulty: 4
  },
  {
    id: 2,
    category: "algebra",
    statement:
      "Find the sum of all real values of $x$ satisfying $|2x - 7| = |x + 3|$.",
    answer: "34/3",
    difficulty: 3
  },
  {
    id: 3,
    category: "algebra",
    statement:
      "The polynomial $p(x) = x^3 - 6x^2 + 11x - 6$ has roots $r, s, t$. Find $r^2 + s^2 + t^2$.",
    answer: "14",
    difficulty: 3
  },
  {
    id: 4,
    category: "algebra",
    statement:
      "Find the value of $$\\frac{1}{1 \\cdot 2} + \\frac{1}{2 \\cdot 3} + \\frac{1}{3 \\cdot 4} + \\cdots + \\frac{1}{99 \\cdot 100}.$$",
    answer: "99/100",
    difficulty: 3
  },
  {
    id: 5,
    category: "algebra",
    statement:
      "If $\\log_2(x) + \\log_4(x) + \\log_8(x) = 11$, find $x$.",
    answer: "64",
    difficulty: 3
  },
  {
    id: 6,
    category: "algebra",
    statement:
      "Find the sum of all integers $n$ such that $\\dfrac{n^2 + 5n + 2}{n + 1}$ is an integer.",
    answer: "-4",
    difficulty: 4
  },
  {
    id: 7,
    category: "algebra",
    statement:
      "The function $f(x) = ax^2 + bx + c$ satisfies $f(1) = 5$, $f(2) = 12$, and $f(3) = 23$. Find $f(5)$.",
    answer: "57",
    difficulty: 3
  },
  {
    id: 8,
    category: "algebra",
    statement:
      "How many ordered pairs of positive integers $(a, b)$ satisfy $\\dfrac{1}{a} + \\dfrac{1}{b} = \\dfrac{1}{6}$?",
    answer: "9",
    difficulty: 4
  },
  {
    id: 9,
    category: "algebra",
    statement:
      "Find the value of $(2 + \\sqrt{3})^4 + (2 - \\sqrt{3})^4$.",
    answer: "194",
    difficulty: 4
  },
  {
    id: 10,
    category: "algebra",
    statement:
      "If $a, b, c$ are the roots of $x^3 - 3x^2 + 5x - 1 = 0$, find $\\dfrac{1}{a} + \\dfrac{1}{b} + \\dfrac{1}{c}$.",
    answer: "5",
    difficulty: 3
  },
  {
    id: 11,
    category: "algebra",
    statement:
      "Solve for $x$: $2^{2x} - 5 \\cdot 2^x + 4 = 0$. Find the sum of all solutions.",
    answer: "2",
    difficulty: 3
  },
  {
    id: 12,
    category: "algebra",
    statement:
      "If $x^2 + y^2 = 25$ and $xy = 12$, find $x^4 + y^4$.",
    answer: "337",
    difficulty: 4
  },
  {
    id: 13,
    category: "algebra",
    statement:
      "Find the coefficient of $x^3$ in the expansion of $(2x - 3)^5$.",
    answer: "720",
    difficulty: 3
  },
  {
    id: 14,
    category: "algebra",
    statement:
      "A geometric sequence has first term $3$ and common ratio $2$. What is the sum of the first $8$ terms?",
    answer: "765",
    difficulty: 3
  },
  {
    id: 15,
    category: "algebra",
    statement:
      "Find the minimum value of $x^2 + 4x + 8$.",
    answer: "4",
    difficulty: 2
  },
  {
    id: 16,
    category: "algebra",
    statement:
      "If $\\sin(\\theta) = \\dfrac{3}{5}$ and $\\theta$ is in the first quadrant, find $\\tan(2\\theta)$.",
    answer: "24/7",
    difficulty: 4
  },
  {
    id: 17,
    category: "algebra",
    statement:
      "Let $a$ and $b$ be positive reals with $a + b = 1$. Find the minimum value of $\\dfrac{1}{a} + \\dfrac{4}{b}$.",
    answer: "9",
    difficulty: 4
  },
  {
    id: 18,
    category: "algebra",
    statement:
      "Find the sum $$\\sum_{k=1}^{20} k^2.$$",
    answer: "2870",
    difficulty: 2
  },

  // ── NUMBER THEORY ────────────────────────────────────────────────
  {
    id: 19,
    category: "number-theory",
    statement:
      "Find the remainder when $3^{100}$ is divided by $7$.",
    answer: "4",
    difficulty: 3
  },
  {
    id: 20,
    category: "number-theory",
    statement:
      "How many positive integers less than $100$ are coprime to $100$?",
    answer: "40",
    difficulty: 3
  },
  {
    id: 21,
    category: "number-theory",
    statement:
      "Find the last two digits of $7^{2026}$.",
    answer: "49",
    difficulty: 4
  },
  {
    id: 22,
    category: "number-theory",
    statement:
      "How many trailing zeros does $100!$ have?",
    answer: "24",
    difficulty: 3
  },
  {
    id: 23,
    category: "number-theory",
    statement:
      "What is the largest prime factor of $2^{16} - 1$?",
    answer: "257",
    difficulty: 4
  },
  {
    id: 24,
    category: "number-theory",
    statement:
      "Find the number of positive divisors of $2^4 \\times 3^3 \\times 5^2$.",
    answer: "60",
    difficulty: 2
  },
  {
    id: 25,
    category: "number-theory",
    statement:
      "What is the sum of all positive divisors of $120$?",
    answer: "360",
    difficulty: 3
  },
  {
    id: 26,
    category: "number-theory",
    statement:
      "Find $\\gcd(2^{15} - 1,\\; 2^{10} - 1)$.",
    answer: "31",
    difficulty: 4
  },
  {
    id: 27,
    category: "number-theory",
    statement:
      "What is the digital root of $2^{100}$? (The digital root is the repeated digit sum until a single digit remains.)",
    answer: "7",
    difficulty: 3
  },
  {
    id: 28,
    category: "number-theory",
    statement:
      "How many integers from $1$ to $1000$ are perfect squares or perfect cubes?",
    answer: "38",
    difficulty: 3
  },
  {
    id: 29,
    category: "number-theory",
    statement:
      "Find the sum of all primes $p$ such that $p^2 + 2$ is also prime.",
    answer: "3",
    difficulty: 4
  },
  {
    id: 30,
    category: "number-theory",
    statement:
      "How many ordered pairs $(a, b)$ of positive integers satisfy $a^2 - b^2 = 120$?",
    answer: "4",
    difficulty: 4
  },
  {
    id: 31,
    category: "number-theory",
    statement:
      "Find the units digit of $3^1 + 3^2 + 3^3 + \\cdots + 3^{100}$.",
    answer: "0",
    difficulty: 3
  },
  {
    id: 32,
    category: "number-theory",
    statement:
      "How many trailing zeros does $200!$ have?",
    answer: "49",
    difficulty: 3
  },
  {
    id: 33,
    category: "number-theory",
    statement:
      "Find the number of integers between $1$ and $1000$ (inclusive) that are divisible by $3$ or $5$ but not both.",
    answer: "401",
    difficulty: 3
  },
  {
    id: 34,
    category: "number-theory",
    statement:
      "The product of two consecutive positive even integers is $288$. Find their sum.",
    answer: "34",
    difficulty: 2
  },
  {
    id: 35,
    category: "number-theory",
    statement:
      "Find $\\lfloor \\sqrt{2026} \\rfloor$.",
    answer: "45",
    difficulty: 2
  },
  {
    id: 36,
    category: "number-theory",
    statement:
      "Find the sum $1 + 2 + 4 + 8 + \\cdots + 2^{15}$.",
    answer: "65535",
    difficulty: 2
  },
  {
    id: 37,
    category: "number-theory",
    statement:
      "Find the remainder when $7! + 8! + 9!$ is divided by $13$.",
    answer: "11",
    difficulty: 4
  },

  // ── COMBINATORICS ────────────────────────────────────────────────
  {
    id: 38,
    category: "combinatorics",
    statement:
      "How many ways can you distribute $12$ identical balls into $3$ distinct boxes such that each box contains at least $2$ balls?",
    answer: "28",
    difficulty: 3
  },
  {
    id: 39,
    category: "combinatorics",
    statement:
      "In how many ways can $5$ distinct books be arranged on a shelf if books $A$ and $B$ must not be adjacent?",
    answer: "72",
    difficulty: 3
  },
  {
    id: 40,
    category: "combinatorics",
    statement:
      "A committee of $5$ is to be formed from $6$ men and $4$ women. In how many ways can this be done if the committee must contain at least $2$ women?",
    answer: "186",
    difficulty: 3
  },
  {
    id: 41,
    category: "combinatorics",
    statement:
      "How many ways are there to climb a staircase of $10$ steps if you can take $1$ or $2$ steps at a time?",
    answer: "89",
    difficulty: 3
  },
  {
    id: 42,
    category: "combinatorics",
    statement:
      "How many subsets of $\\{1, 2, 3, \\ldots, 10\\}$ contain no two consecutive integers?",
    answer: "144",
    difficulty: 4
  },
  {
    id: 43,
    category: "combinatorics",
    statement:
      "A standard die is rolled $4$ times. What is the probability that the maximum value rolled is exactly $4$? Express your answer as a simplified fraction.",
    answer: "175/1296",
    difficulty: 4
  },
  {
    id: 44,
    category: "combinatorics",
    statement:
      "How many distinct permutations of the letters in MISSISSIPPI are there?",
    answer: "34650",
    difficulty: 3
  },
  {
    id: 45,
    category: "combinatorics",
    statement:
      "How many lattice paths are there from $(0,0)$ to $(4,3)$, moving only right or up at each step?",
    answer: "35",
    difficulty: 2
  },
  {
    id: 46,
    category: "combinatorics",
    statement:
      "How many $3$-digit numbers have all distinct digits?",
    answer: "648",
    difficulty: 2
  },
  {
    id: 47,
    category: "combinatorics",
    statement:
      "A pizza shop offers $8$ toppings. How many different pizzas can be made with at least $3$ toppings?",
    answer: "219",
    difficulty: 3
  },
  {
    id: 48,
    category: "combinatorics",
    statement:
      "How many binary strings of length $8$ contain no two consecutive $0$s?",
    answer: "55",
    difficulty: 4
  },
  {
    id: 49,
    category: "combinatorics",
    statement:
      "A bag contains $5$ red, $3$ blue, and $2$ green balls. If $3$ balls are drawn without replacement, what is the probability that all $3$ are the same color? Express as a simplified fraction.",
    answer: "11/120",
    difficulty: 3
  },
  {
    id: 50,
    category: "combinatorics",
    statement:
      "How many positive integer solutions does $x + y + z = 20$ have with $x < y < z$?",
    answer: "24",
    difficulty: 4
  },
  {
    id: 51,
    category: "combinatorics",
    statement:
      "How many ways can you make change for $\\$1$ using only quarters ($25$¢), dimes ($10$¢), and nickels ($5$¢)?",
    answer: "29",
    difficulty: 4
  },
  {
    id: 52,
    category: "combinatorics",
    statement:
      "How many distinct permutations of the letters in BANANA are there?",
    answer: "60",
    difficulty: 2
  },
  {
    id: 53,
    category: "combinatorics",
    statement:
      "How many diagonals does a convex $10$-sided polygon have?",
    answer: "35",
    difficulty: 2
  },

  // ── GEOMETRY ─────────────────────────────────────────────────────
  {
    id: 54,
    category: "geometry",
    statement:
      "In $\\triangle ABC$ with $AB = 13$, $BC = 14$, $CA = 15$, find the area of the triangle.",
    answer: "84",
    difficulty: 3
  },
  {
    id: 55,
    category: "geometry",
    statement:
      "A right triangle has legs of length $5$ and $12$. What is the length of the altitude from the right angle to the hypotenuse? Express as a simplified fraction.",
    answer: "60/13",
    difficulty: 3
  },
  {
    id: 56,
    category: "geometry",
    statement:
      "The diagonals of a rhombus have lengths $10$ and $24$. What is the perimeter of the rhombus?",
    answer: "52",
    difficulty: 3
  },
  {
    id: 57,
    category: "geometry",
    statement:
      "A circle is inscribed in a right triangle with legs $6$ and $8$. What is the radius of the inscribed circle?",
    answer: "2",
    difficulty: 3
  },
  {
    id: 58,
    category: "geometry",
    statement:
      "What is the area of the triangle with vertices at $(0,0)$, $(4,0)$, and $(1,5)$?",
    answer: "10",
    difficulty: 2
  },
  {
    id: 59,
    category: "geometry",
    statement:
      "In a regular octagon, what is the measure (in degrees) of each interior angle?",
    answer: "135",
    difficulty: 2
  },
  {
    id: 60,
    category: "geometry",
    statement:
      "A square has diagonal length $10$. What is its area?",
    answer: "50",
    difficulty: 2
  },
  {
    id: 61,
    category: "geometry",
    statement:
      "What is the sum of the interior angles (in degrees) of a convex polygon with $12$ sides?",
    answer: "1800",
    difficulty: 2
  },
  {
    id: 62,
    category: "geometry",
    statement:
      "In a right triangle, one acute angle is twice the other. If the hypotenuse is $10$, what is the length of the shortest side?",
    answer: "5",
    difficulty: 2
  },
  {
    id: 63,
    category: "geometry",
    statement:
      "A trapezoid has parallel sides of length $8$ and $14$, and its height is $6$. What is its area?",
    answer: "66",
    difficulty: 2
  },
  {
    id: 64,
    category: "geometry",
    statement:
      "A rectangle has perimeter $40$. What is the maximum possible area?",
    answer: "100",
    difficulty: 3
  },
  {
    id: 65,
    category: "geometry",
    statement:
      "A ladder $10$ meters long leans against a vertical wall. The foot of the ladder is $6$ meters from the wall. How high up the wall does the ladder reach?",
    answer: "8",
    difficulty: 2
  },
  {
    id: 66,
    category: "geometry",
    statement:
      "Two concentric circles have radii $3$ and $7$. What is the area of the annular region between them? Express your answer in terms of $\\pi$, writing just the coefficient (e.g. if the answer is $12\\pi$, enter $12$).",
    answer: "40",
    difficulty: 3
  },
  {
    id: 67,
    category: "geometry",
    statement:
      "In $\\triangle ABC$, $\\angle A = 90°$, $AB = 9$, $AC = 12$. Point $D$ is the foot of the altitude from $A$ to $BC$. Find $AD$. Express as a simplified fraction.",
    answer: "36/5",
    difficulty: 4
  },
  {
    id: 68,
    category: "geometry",
    statement:
      "A regular hexagon has side length $6$. Find the area of the hexagon. Express your answer in the form $a\\sqrt{b}$ and enter $a \\cdot b$ (e.g. if the answer is $5\\sqrt{3}$, enter $15$).",
    answer: "162",
    difficulty: 4
  },

  // ── HARD COMPETITION PROBLEMS ────────────────────────────────────
  {
    id: 69,
    category: "number-theory",
    statement:
      "How many positive integers $n \\le 1000$ satisfy $\\gcd(n, 100) > 1$ and $\\gcd(n, 75) > 1$ simultaneously?",
    answer: "467",
    difficulty: 5
  },
  {
    id: 70,
    category: "algebra",
    statement:
      "Let $r$ and $s$ be the roots of $x^2 - 7x + 3 = 0$. Find $r^3 + s^3$.",
    answer: "280",
    difficulty: 4
  },
  {
    id: 71,
    category: "combinatorics",
    statement:
      "In how many ways can a $2 \\times 10$ grid be tiled by $1 \\times 2$ dominoes?",
    answer: "89",
    difficulty: 5
  },
  {
    id: 72,
    category: "number-theory",
    statement:
      "Find the smallest positive integer $n$ such that $n!$ is divisible by $2^{10}$.",
    answer: "12",
    difficulty: 4
  },
  {
    id: 73,
    category: "algebra",
    statement:
      "Let $f(x) = x^2 + 1$. Find $f(f(f(0)))$.",
    answer: "5",
    difficulty: 2
  },
  {
    id: 74,
    category: "combinatorics",
    statement:
      "The number of derangements (permutations with no fixed points) of $\\{1, 2, 3, 4, 5\\}$ is $D_5$. Find $D_5$.",
    answer: "44",
    difficulty: 4
  },
  {
    id: 75,
    category: "number-theory",
    statement:
      "Find the last digit of $7^{7^7}$.",
    answer: "3",
    difficulty: 5
  },
  {
    id: 76,
    category: "algebra",
    statement:
      "If $a + b + c = 6$, $ab + bc + ca = 11$, and $abc = 6$, find $a^2 + b^2 + c^2$.",
    answer: "14",
    difficulty: 3
  },
  {
    id: 77,
    category: "combinatorics",
    statement:
      "In a group of $10$ people, each pair of people are either friends or strangers. What is the minimum number of pairs of friends needed to guarantee there exist $3$ mutual friends?",
    answer: "41",
    difficulty: 5
  },
  {
    id: 78,
    category: "algebra",
    statement:
      "Find the sum of all positive integers $n$ for which $n^2 + 12n + 36$ is a perfect square.",
    answer: "12",
    difficulty: 3
  },
  {
    id: 79,
    category: "number-theory",
    statement:
      "How many factors of $10^8$ are neither a factor of $10^4$ nor a factor of $10^6$?",
    answer: "22",
    difficulty: 5
  },
  {
    id: 80,
    category: "algebra",
    statement:
      "Find the value of $$\\frac{1}{1+\\frac{1}{2+\\frac{1}{3}}}.$$",
    answer: "7/10",
    difficulty: 3
  }
];
