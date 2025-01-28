DELETE WATCH PROVIDERS
DELETE NETWORKS
DELETE GENRES

Apply this to prod database
{
$set: {
genreIds: [],
watchProviderIds: [],
networkIds: [],
},
$unset: {
networksIds: true,
watchProvidersIds: true,
}
}
