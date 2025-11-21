from sentence_transformers import SentenceTransformer
from prisma import Prisma
import sys

if len(sys.argv) > 1:
    query = sys.argv[1]
    print("Received Query:", query)
else:
    print("No Query provided")
    exit(1)

# Load local model
print("loading model")
model = SentenceTransformer("all-MiniLM-L6-v2")

print("connecting to db")
db = Prisma()
db.connect()


embedding = model.encode(query, normalize_embeddings=True).tolist()
vector_str = ','.join(map(str, embedding))

results = db.query_raw(f"SELECT id, COALESCE(\"modifiedName\", name) as display_name FROM \"Product\" ORDER BY embedding <=> '[{vector_str}]'::vector LIMIT 20")

for row in results:
    print(row)