from sentence_transformers import SentenceTransformer
from prisma import Prisma

print("loading model")
model = SentenceTransformer("all-MiniLM-L6-v2")


print("connecting to db")
db = Prisma()
db.connect()

offset = 0
limit = 1000


while True:
    texts = []
    product_ids = []

    chunk = db.product.find_many(skip=offset, take=limit, include={"subcategory": {"include": {"category": True}}, "supplier": True})
    
    if not chunk:
        break
    
    for product in chunk:
        text = f"product_name:{product.name}"
        if product.price:
            text += f", product_price:{product.price}"
        if product.priceUnit:
            text += f", product_price_unit:{product.priceUnit}"
        if product.brand:
            text += f", product_brand:{product.brand}"
        if product.specifications:
            text += f", product_specifications:{product.specifications}"
        if product.subcategory:
            text += f", product_subcategory:{product.subcategory.name}"
            if product.subcategory.category:
                text += f", product_category:{product.subcategory.category.name}"
        if product.supplier:
            text += f", supplier_name:{product.supplier.name}"
            if product.supplier.location:
                text += f", supplier_location:{product.supplier.location}"
        
        texts.append(text)
        product_ids.append(product.id)

    offset += limit

    if offset >= 200000:
        break

    embeddings = model.encode(texts, batch_size=64, normalize_embeddings=True).tolist()
    values_str = ",".join(f"({pid}, '[{','.join(map(str, emb))}]'::vector)" for pid, emb in zip(product_ids, embeddings))

    sql = f"""
    UPDATE "Product" AS p
    SET embedding = v.embedding
    FROM (VALUES {values_str}) AS v(id, embedding)
    WHERE p.id = v.id;
    """

    db.execute_raw(sql)

    print(f"offset:{offset} chunk:{len(chunk)} processed")