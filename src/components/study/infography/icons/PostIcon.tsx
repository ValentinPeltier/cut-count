import { Post } from '@/lib/utils/charts'
import { BilletterieEtCommunicationIcon } from './billetterieetcommunication'
import { ConfiseriesEtBoissonsIcon } from './confiseriesetboissons'
import { DechetsIcon } from './dechets'
import { FonctionnementIcon } from './fonctionnement'
import { MobiliteSpectateursIcon } from './mobilitespecctateurs'
import { SallesEtCabinesIcon } from './sallesetcabines'
import { TourneesAvantPremiereIcon } from './tourneesavantpremiere'

interface Props {
  post: Post
  className?: string
}

const PostIcon = ({ post, className }: Props) => {
  switch (post) {
    case Post.Fonctionnement:
      return <FonctionnementIcon className={className} />
    case Post.MobiliteSpectateurs:
      return <MobiliteSpectateursIcon className={className} />
    case Post.TourneesAvantPremieres:
      return <TourneesAvantPremiereIcon className={className} />
    case Post.SallesEtCabines:
      return <SallesEtCabinesIcon className={className} />
    case Post.ConfiseriesEtBoissons:
      return <ConfiseriesEtBoissonsIcon className={className} />
    case Post.Dechets:
      return <DechetsIcon className={className} />
    case Post.BilletterieEtCommunication:
      return <BilletterieEtCommunicationIcon className={className} />
    default:
      return null
  }
}

export default PostIcon
