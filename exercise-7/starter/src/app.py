import os
from gql import Client
from gql.client import AsyncClientSession
from gql.transport.aiohttp import AIOHTTPTransport

from .queries import request_full
from .gql import gql
from .analyze import analyse
from .finding import create_finding


async def process_requests(client: AsyncClientSession, after: str = None):
    query = gql(
        """
        query Requests($first: Int, $after: String) {
            # CODE: Grapql query to get requests using RequestFull fragment and pageInfo
        }
        """,
        request_full,
    )

    after = None
    i = 0
    while True:
        result = [] # CODE

        for request in result["requests"]["nodes"]:
            finding = analyse(request)
            if finding:
                print(f"[-] Found reflected parameter(s) {finding.parameters} in request {finding.id}")
                await create_finding(client, finding)

        i += len(result["requests"]["nodes"])
        print(f"[*] Processed {i} requests")

        # CODE: Check if pageInfo hasNextPage is True and update after with endCursor, otherwise break the loop


async def app():
    auth = {"Authorization": f"Bearer {os.getenv('ACCESS_TOKEN')}"}

    transport_queries = AIOHTTPTransport(
        url= f"http://{os.getenv("CAIDO_ENDPOINT")}/graphql",
        headers=auth,
    )

    async with Client(
        transport=transport_queries, fetch_schema_from_transport=True, parse_results=True
    ) as client_queries:
        await process_requests(client_queries)
