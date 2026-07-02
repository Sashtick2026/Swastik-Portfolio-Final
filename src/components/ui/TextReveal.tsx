import { motion } from "motion/react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  tag?: "h1" | "h2" | "p" | "span";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.8,
  tag = "h2",
}: TextRevealProps) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { y: "110%" },
    visible: {
      y: 0,
      transition: {
        duration: duration,
        ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier for slick, expensive deceleration
      },
    },
  };

  const Tag = tag as any;

  return (
    <Tag className={`overflow-hidden inline-flex flex-wrap ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="inline-flex flex-wrap"
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block mr-[0.25em] py-[0.1em] -my-[0.1em]">
            <motion.span
              variants={wordVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
