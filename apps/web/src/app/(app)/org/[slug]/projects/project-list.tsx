'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getActors } from '@/http/get-actors'
import { getDepartaments } from '@/http/get-departaments'
import { getProjects } from '@/http/get-projects'

dayjs.extend(relativeTime)

export function ProjectList() {
  const { slug: currentOrg } = useParams<{
    slug: string
  }>()

  const [filters, setFilters] = useState<Record<string, string>>({})

  const { data: dataProjects } = useQuery({
    queryKey: [currentOrg, 'projects', filters],
    queryFn: () => getProjects(currentOrg, filters),
  })

  const { data: dataDepartaments } = useQuery({
    queryKey: [currentOrg, 'departaments'],
    queryFn: () => getDepartaments(currentOrg),
  })

  const { data: dataActors } = useQuery({
    queryKey: [currentOrg, 'actors'],
    queryFn: () => getActors(currentOrg),
  })

  function onChangeFilter(key: string, value: string) {
    console.log(key, value)
    setFilters((prev) => {
      if (value === '0') {
        const clone = { ...prev }
        delete clone[key]
        return clone
      }

      return { ...prev, [key]: value }
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Filter by name..."
            onChange={(e) =>
              onChangeFilter(
                'name',
                e.target.value !== '' ? e.target.value : '0',
              )
            }
          />
        </div>

        <div className="w-full">
          <Select
            name="departamentId"
            onValueChange={(departamentId) =>
              onChangeFilter('requestingDepartamentId', departamentId)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by requesting departament..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" className="text-muted-foreground">
                Filter by requesting departament...
              </SelectItem>
              {dataDepartaments?.departaments.map((departament) => (
                <SelectItem key={departament.id} value={departament.id}>
                  {departament.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select
            name="agentId"
            onValueChange={(agentId) => onChangeFilter('agentId', agentId)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by agent..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" className="text-muted-foreground">
                Filter by agent...
              </SelectItem>
              {dataActors?.actors.map((actor) => (
                <SelectItem key={actor.user.id} value={actor.user.id}>
                  {actor.user.name ?? actor.user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select
            name="managerId"
            onValueChange={(managerId) =>
              onChangeFilter('managerId', managerId)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by manager..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" className="text-muted-foreground">
                Filter by manager...
              </SelectItem>
              {dataActors?.actors.map((actor) => (
                <SelectItem key={actor.user.id} value={actor.user.id}>
                  {actor.user.name ?? actor.user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr />

      <div className="grid grid-cols-3 gap-4">
        {dataProjects?.projects.map((project) => {
          return (
            <Card key={project.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  {project.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center gap-1.5">
                <div className="flex flex-col">
                  <span className="text-xs">
                    <span className="font-semibold text-foreground">
                      Created by:
                    </span>{' '}
                    <span>
                      {project.requestingDepartament.name}{' '}
                      <span className="text-muted-foreground">
                        ({dayjs(project.createdAt).fromNow()})
                      </span>
                    </span>
                  </span>

                  <span className="text-xs">
                    <span className="font-semibold">Agent:</span>{' '}
                    {project.agent?.name ?? project.agent?.email}
                  </span>

                  <span className="text-xs">
                    <span className="font-semibold">Manager:</span>{' '}
                    {project.manager.name ?? project.manager.email}
                  </span>
                </div>

                <Button size="xs" variant="outline" className="ml-auto" asChild>
                  <Link href={`/org/${currentOrg!}/projects/${project.slug}`}>
                    View <ArrowRight className="ml-2 size-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
