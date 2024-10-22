import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Mail, Linkedin, Github } from "lucide-react"

interface Developer {
  name: string
  role: string
  bio: string
  email: string
  linkedin: string
  twitter: string
  github: string
  avatar?: string
}

const developers: Developer[] = [
  {
    name: "Ayush Kalathiya",
    role: "Full Stack Developer",
    bio: "Expert in Next.js, PostgreSQL, and Node.js development. Passionate about creating intuitive user interfaces backed by robust server architectures.",
    email: "ayushkalathiya50@gmail.com",
    linkedin: "https://www.linkedin.com/in/ayush-kalathiya-750497254",
    twitter: "https://x.com/AyushKalathiya9",
    github: "https://github.com/Ayushkalathiya",
  },
  {
    name: "Dhruv Kotadiya",
    role: "Full Stack Developer",
    bio: "Expert in Next.js, PostgreSQL, and Node.js development. Focuses on creating scalable database solutions and responsive web applications.",
    email: "dhruvkotadiya0235@gmail.com",
    linkedin: "https://www.linkedin.com/in/dhruv-kotadiya-86b2212ba",
    twitter: "https://x.com/DhruvKotad72384",
    github: "https://github.com/DhruvK007",
  },
  {
    name: "Sarthak Mayani",
    role: "Full Stack Developer",
    bio: "Expert in Next.js, PostgreSQL, and Node.js development. Dedicated to building efficient solutions and exploring new technologies.",
    email: "mayanisarthak@gmail.com",
    linkedin: "https://www.linkedin.com/in/sarthak-mayani-5250b1286",
    twitter: "https://x.com/SarthakMayani",
    github: "https://github.com/MACOOF",
  },
]

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 462.799"
    className="h-4 w-4"
  >
    <path
      fill="currentColor"
      fillRule="nonzero"
      d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
    />
  </svg>
)

export default function DeveloperSection() {
  return (
    <section className="w-full bg-gradient-to-b from-background to-secondary/10 py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold dark:text-white">
          Meet Our Developers
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {developers.map((developer) => (
            <Card
              key={developer.name}
              className="flex h-full transform flex-col bg-background/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-zinc-950/80"
            >
              <CardHeader className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    {developer.avatar && (
                      <img
                        src={developer.avatar}
                        alt={developer.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-gray-200 text-4xl text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {developer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2 text-center">
                  <CardTitle className="text-xl">{developer.name}</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {developer.role}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                <p className="text-center text-sm text-muted-foreground">
                  {developer.bio}
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link href={`mailto:${developer.email}`}>
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email {developer.name}</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">
                        {developer.name}'s LinkedIn
                      </span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link
                      href={developer.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon />
                      <span className="sr-only">
                        {developer.name}'s Twitter
                      </span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link
                      href={developer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      <span className="sr-only">{developer.name}'s GitHub</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
