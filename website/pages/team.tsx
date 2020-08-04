import {
  Avatar,
  Box,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  Wrap,
} from "@chakra-ui/core"
import SEO from "components/seo"
import * as React from "react"
import { IoIosGlobe, IoLogoGithub, IoLogoTwitter } from "react-icons/io"
import { SkipNavContent, SkipNavLink } from "@chakra-ui/skip-nav"
import Header from "components/header"
import { Octokit } from "@octokit/rest"
import path from "path"
import fs from "fs"

const SocialLink = ({ icon, href }) => (
  <Link display="inline-block" href={href} isExternal>
    <Icon
      as={icon}
      transition="all 0.2s"
      _hover={{ color: "teal.600" }}
      fontSize="xl"
      color="teal.500"
    />
  </Link>
)

function Member({ member }) {
  const {
    avatar_url: avatarUrl,
    bio,
    name,
    twitter_username: twitterUsername,
    blog: websiteUrl,
    html_url: url,
  } = member

  return (
    <Box>
      <Stack direction="row" spacing={6}>
        <Avatar size="xl" src={avatarUrl} />
        <Stack spacing={3} maxW="320px">
          <Text fontWeight="bold" fontSize="md">
            {name}
          </Text>

          <Stack direction="row" spacing={2}>
            <SocialLink href={url} icon={IoLogoGithub} />
            {twitterUsername && (
              <SocialLink
                href={`https://twitter.com/${twitterUsername}`}
                icon={IoLogoTwitter}
              />
            )}
            {websiteUrl && <SocialLink href={websiteUrl} icon={IoIosGlobe} />}
          </Stack>
          <Text>{bio}</Text>
        </Stack>
      </Stack>
    </Box>
  )
}

function Contributor({ contributor }) {
  const { login, avatar_url: avatarUrl } = contributor

  return (
    <Box>
      <Tooltip hasArrow label={login} placement="top">
        <Link href={`https://github.com/${login}`} isExternal>
          <Avatar size="md" src={avatarUrl} />
        </Link>
      </Tooltip>
    </Box>
  )
}

function Team({ members, contributors }) {
  const memberLogins = members.map(({ login }) => login)
  const contributorsWithoutTeam = contributors.filter(
    ({ login }) => !memberLogins.includes(login),
  )

  return (
    <>
      <SEO
        title="Chakra UI Team and Contributors"
        description="List of team members and contributors that make the Chakra UI project possible"
      />
      <SkipNavLink zIndex={20}>Skip to Content</SkipNavLink>
      <Header />

      <Box mt="120px" mb="60px">
        <SkipNavContent />
        <Box
          w="full"
          px="1rem"
          py="80px"
          pb="12"
          pt="3"
          mx="auto"
          maxW="1280px"
        >
          <Heading as="h1" size="xl" mb="5">
            Chakra UI Team &amp; Contributors
          </Heading>
          <Text maxW="60ch">
            The people listed on this page have contributed time, effort, and
            thought to Chakra UI. Without them, this project would not be
            possible.
          </Text>
        </Box>

        <Box w="full" px="1rem" pb="12" pt="3" mx="auto" maxW="1280px">
          <Stack spacing={8}>
            <Heading size="md">Core Team</Heading>
            <SimpleGrid columns={[1, 1, 2]} spacing="40px">
              {members.map((member) => (
                <Member key={member.login} member={member} />
              ))}
            </SimpleGrid>
          </Stack>

          <Stack spacing={8} mt="100px">
            <Heading size="md">Project Contributors</Heading>
            <Wrap spacing="3">
              {contributorsWithoutTeam.map((contributor) => (
                <Contributor
                  key={contributor.login}
                  contributor={contributor}
                />
              ))}
            </Wrap>
          </Stack>
        </Box>
      </Box>
    </>
  )
}

const sortMembers = (a, b) => {
  // segun comes first!
  if (a.login === "segunadebayo") return -1
  if (b.login === "segunadebayo") return 1

  // everything else is alphabetical by login
  return a.login.localeCompare(b.login, "en")
}

export async function getStaticProps() {
  /**
   * Read the profile/bio of each member of the Chakra UI team.
   * @todo consider writing this to a file for caching (e.g .all-membersrc)
   */
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  const { data: members } = await octokit.orgs.listMembers({ org: "chakra-ui" })

  const membersData: any[] = await Promise.all(
    members.map(
      async ({ login }) =>
        await octokit.users.getByUsername({ username: login }),
    ),
  )

  const sortedMembers = membersData.map((m) => m.data).sort(sortMembers)

  /**
   * Read contributors from `.all-contributorsrc` file
   * to avoid overfetching from Github
   */
  const rcPath = path.resolve("..", ".all-contributorsrc")
  const contributorsRcData = fs.readFileSync(rcPath, "utf-8")
  const { contributors } = JSON.parse(contributorsRcData)

  return {
    props: {
      members: sortedMembers,
      contributors,
    },
  }
}

export default Team
